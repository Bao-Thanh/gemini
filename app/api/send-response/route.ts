import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

export async function POST(request: Request) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error("Missing email credentials")
    return NextResponse.json(
      { success: false, error: "Missing email configuration" },
      { status: 500 }
    )
  }

  try {
    const data = await request.json()

    // 👉 Xác định lựa chọn cuối theo activity
    let choiceLabel = ""
    let choiceValue = ""

    if (data.activity === "eat") {
      choiceLabel = "Restaurant"
      choiceValue = data.food?.[0] || "Not selected"
    }

    if (data.activity === "movie") {
      choiceLabel = "Cinema"
      choiceValue = data.movie || "Not selected"
    }

    if (data.activity === "coffee") {
      choiceLabel = "Café"
      choiceValue = data.movie || "Not selected"
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "💕 New Date Response!",
      html: `
        <h1>💖 She said YES!</h1>

        <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${data.time}</p>

        <hr />

        <p><strong>Activity:</strong> ${data.activity}</p>
        <p><strong>${choiceLabel}:</strong> ${choiceValue}</p>

        ${
          data.address
            ? `<p><strong>Address:</strong> ${data.address}</p>`
            : ""
        }

        ${
          data.map
            ? `<p><strong>Google Maps:</strong> <a href="${data.map}" target="_blank">${data.map}</a></p>`
            : ""
        }

        <hr />

        <p><strong>Excitement:</strong> ${data.excitement}/100 💕</p>
      `,
      attachments: [
        {
          filename: `date-response-${new Date().toISOString()}.json`,
          content: JSON.stringify(data, null, 2),
          contentType: "application/json",
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Failed to send email:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    )
  }
}
