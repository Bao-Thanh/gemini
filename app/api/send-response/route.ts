import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// 🚨 BẮT BUỘC: nodemailer chỉ chạy với Node runtime
export const runtime = "nodejs"

export async function POST(request: Request) {
  // ✅ Check env TRƯỚC – tránh crash cold start
  const EMAIL_USER = process.env.EMAIL_USER
  const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD

  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
    console.error("❌ Missing email credentials")
    return NextResponse.json(
      { success: false, error: "Missing email configuration" },
      { status: 500 }
    )
  }

  try {
    // ✅ Parse body
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

    // ✅ Tạo transporter TRONG handler
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD,
      },
    })

    // (Optional) verify – rất hữu ích khi debug
    await transporter.verify()

    // ✅ Send mail
    await transporter.sendMail({
      from: `"Date Proposal 💕" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: "💕 New Date Response!",
      html: `
        <h1>💖 She said YES!</h1>

        <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${data.time}</p>

        <hr />

        <p><strong>Activity:</strong> ${data.activity}</p>
        <p><strong>${choiceLabel}:</strong> ${choiceValue}</p>

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
  } catch (error) {
    console.error("❌ Failed to send email:", error)

    const message =
      error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
