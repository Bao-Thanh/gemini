'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, Coffee, Film, Utensils, Clock } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Answers {
  isAvailable: boolean | null
  date: Date | null
  time: string
  activity: 'eat' | 'movie' | 'coffee' | null
  food: string[]
  movie: string
  excitement: number
}

// Dynamic import of HeartBackground with no SSR
const HeartBackground = dynamic(
  () => import('@/components/DiamondBackground'),
  {
    ssr: false,
  },
)

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
}

const activityContent: Record<
  NonNullable<Answers['activity']>,
  { title: string; description: string; button: string }
> = {
  coffee: {
    title: 'Coffee sounds nice ☕',
    description: 'We can grab a coffee and have a relaxed chat.',
    button: 'Sounds good!',
  },
  eat: {
    title: 'Let’s get something to eat 🍽️',
    description: 'We can enjoy a meal and get to know each other better.',
    button: 'That works!',
  },
  movie: {
    title: 'How about a movie? 🎬',
    description: 'Watching a movie together sounds fun and easygoing.',
    button: 'Let’s do that!',
  },
}

export default function EnchantingDateProposalApp() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    isAvailable: null,
    date: null,
    time: '',
    activity: null,
    food: [],
    movie: '',
    excitement: 60,
  })

  useEffect(() => {
    if (step === 4 && answers.excitement < 80) {
      setAnswers((prev) => ({
        ...prev,
        excitement: 80,
      }))
    }
  }, [step])

  const eatOptions = [
    {
      name: 'Panda BBQ',
      address: '6 Đ. Phạm Hùng, Bình Hưng, Bình Chánh',
      image: '/images/panda.jpg',
      map:
        'https://www.google.com/maps/place/Panda+BBQ/@10.7338042,106.6708145,17z/data=!3m1!4b1!4m6!3m5!1s0x31752ef9452960d9:0xc43f6c436295990c!8m2!3d10.7337989!4d106.6733894!16s%2Fg%2F11bxfrx_xp?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Làng Nướng Nam Bộ Quận 8',
      address: '810 Đ. Tạ Quang Bửu, Phường 5, Quận 8',
      image: '/images/lau.jpg',
      map:
        'https://www.google.com/maps/place/L%C3%A0ng+N%C6%B0%E1%BB%9Bng+Nam+B%E1%BB%99+Qu%E1%BA%ADn+8/@10.7371623,106.6680286,17z/data=!3m1!4b1!4m6!3m5!1s0x31752fa253e701d7:0x29c1c1549b81203!8m2!3d10.737157!4d106.6706035!16s%2Fg%2F11y3mvd3zh?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Buffet Cửu Vân Long - Premium Co.op Lý Thường Kiệt',
      address: '497 Hoà Hảo, Phường 6, Quận 10',
      image: '/images/cuuvanlong.jpg',
      map:
        'https://www.google.com/maps/place/Buffet+C%E1%BB%ADu+V%C3%A2n+Long+-+Premium+Co.op+L%C3%BD+Th%C6%B0%E1%BB%9Dng+Ki%E1%BB%87t/@10.7550483,106.6682505,15.75z/data=!4m14!1m7!3m6!1s0x31752fa253e701d7:0x29c1c1549b81203!2zTMOgbmcgTsaw4bubbmcgTmFtIELhu5kgUXXhuq1uIDg!8m2!3d10.737157!4d106.6706035!16s%2Fg%2F11y3mvd3zh!3m5!1s0x31752f00357ab757:0x9f96b50fbd02d213!8m2!3d10.7601345!4d106.6618984!16s%2Fg%2F11x76kd1mf?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D',
    },
  ]

  const movieOptions = [
    {
      name: 'Galaxy Parc Mall Q8',
      address: 'Vincom Center · District 1',
      image: '/images/galaxy.jpg',
      map:
        '549 Đ. Tạ Quang Bửu, Phường 4, Quận 8, Thành phố Hồ Chí Minh 700000, Việt Nam',
    },
    {
      name: 'LOTTE Cinema Nowzone',
      address:
        'TTTM Nowzone, 235 Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1',
      image: '/images/lotte.jpg',
      map:
        'https://www.google.com/maps/place/LOTTE+Cinema+Nowzone/@10.7642585,106.6775664,17z/data=!3m1!4b1!4m6!3m5!1s0x31752f19358a688d:0x950e00fb59d5e2db!8m2!3d10.7642533!4d106.6824373!16s%2Fg%2F11cn5rm0ws?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D',
    },
  ]

  const coffeeOptions = [
    {
      name: 'Trà sữa KAITEA Phạm Hùng',
      address: '222 Đ. Phạm Hùng, Phường 5, Quận 8',
      image: '/images/KAITEA.jpg',
      map:
        'https://www.google.com/maps/place/Tr%C3%A0+s%E1%BB%AFa+KAITEA+Ph%E1%BA%A1m+H%C3%B9ng/@10.7414635,106.6638889,17z/data=!3m1!4b1!4m6!3m5!1s0x31752fe400b4f3d1:0x9969989869cd9d02!8m2!3d10.7414583!4d106.6687598!16s%2Fg%2F11hyxm2wc5?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Tana Coffee & Tea',
      address: '71/29 Bùi Minh Trực, Phường 6, Quận 8',
      image: '/images/TANA.jpg',
      map:
        'https://www.google.com/maps/place/Tana+Coffee+%26+Tea/@10.7355729,106.6510276,17z/data=!3m1!4b1!4m6!3m5!1s0x31752e429474354b:0x69f57286db521f06!8m2!3d10.7355698!4d106.6539239!16s%2Fg%2F11g9j7_hmd?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D',
    },
  ]

  const handleAnswer = (key: keyof Answers, value: Answers[keyof Answers]) => {
    setAnswers({ ...answers, [key]: value })
    setStep(step + 1)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  useEffect(() => {
    if (!answers.date) {
      setAnswers((prev) => ({
        ...prev,
        date: tomorrow,
      }))
    }
  }, [])

  const steps = [
    // Step 0: Initial Question
    <motion.div key="step0" className="text-center" {...fadeInUp}>
      <h1 className="text-4xl font-bold mb-6 text-pink-600">
        Would you like to go with me to a really special and interesting place?
      </h1>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://media1.tenor.com/m/59regbBE_kwAAAAd/tkthao219-bubududu.gif"
        alt="Cute bear proposal gif"
        className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg"
      />
      <div className="space-x-4">
        <Button
          onClick={() => {
            handleAnswer('isAvailable', true)
            triggerConfetti()
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          Yes, I agree 😊!
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <span className="relative inline-block group">
              {/* Tooltip */}
              <span
                className="absolute -top-12 left-1/2 -translate-x-1/2
                        whitespace-nowrap rounded-lg px-3 py-1.5
                        bg-red-500 text-white text-sm font-bold
                        opacity-0
                        transition-opacity duration-200
                        group-hover:opacity-100
                        shadow-lg shadow-red-400/50 z-50"
              >
                You should really press Yes, because it’s truly a very special
                place 💎
              </span>

              {/* Nút No – sáng sẵn như Yes */}
              <Button
                variant="outline"
                onClick={(e) => e.preventDefault()}
                className="
                bg-pink-500 text-white font-extrabold
                border-pink-500
                py-2 px-4 rounded-full
                cursor-not-allowed
              "
              >
                No
              </Button>
            </span>
          </DialogTrigger>
        </Dialog>
      </div>
    </motion.div>,

    // Step 1: Date and Time Selection
    <motion.div key="step1" className="text-center" {...fadeInUp}>
      <h2 className="text-3xl font-bold mb-6 text-pink-600">
        YEYYYYYYYY, WHEN SHALL WE GO?
      </h2>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://images.openai.com/static-rsc-3/8Ax3PB3zajKKLoxf0WfZVoC7fXIrwQ5jKIlsgw8DOrIoqUFarn8UY8N5SST3u_tHwAmbvN_2OzHleYGZ8iR-3Q1afEk92KJmUdTFiG4MjLw?purpose=fullsize"
        alt="Excited bear gif"
        className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg"
      />
      <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={answers.date || undefined}
          onSelect={(date) =>
            setAnswers((prev) => ({ ...prev, date: date || null }))
          }
          defaultMonth={tomorrow}
          className="mx-auto mb-4"
          disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
        />

        <Select onValueChange={(time) => setAnswers({ ...answers, time })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 25 }, (_, i) => {
              // 9:00 -> 21:00, mỗi 30 phút
              const totalMinutes = 9 * 60 + i * 30
              const hour = Math.floor(totalMinutes / 60)
              const minute = totalMinutes % 60

              const value = `${hour
                .toString()
                .padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

              return (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={() => setStep(step + 1)}
        disabled={!answers.date || !answers.time}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Clock className="mr-2 h-5 w-5" />
        Set this date!
        <span className="ml-2 text-xl">♈️</span>
      </Button>
    </motion.div>,

    // Step 2: Food Selection
    <motion.div key="step2" className="text-center" {...fadeInUp}>
      <h2 className="text-3xl font-bold mb-6 text-pink-600">
        What would you like to do?
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {[
          { key: 'eat', label: 'Go eat', icon: <Utensils /> },
          { key: 'movie', label: 'Watch a movie', icon: <Film /> },
          { key: 'coffee', label: 'Coffee time', icon: <Coffee /> },
        ].map(({ key, label, icon }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-32 flex flex-col items-center justify-center
                      rounded-lg shadow-md bg-white text-pink-600
                      hover:bg-pink-100 font-bold"
            onClick={() => {
              setAnswers({ ...answers, activity: key as Answers['activity'] })
              setStep(step + 1)
            }}
          >
            {icon}
            <span className="mt-2">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>,

    // Step 3: Movie Selection
    <motion.div key="step3" className="text-center" {...fadeInUp}>
      <motion.div key="step3" className="text-center" {...fadeInUp}>
        {/* 🍽️ EAT */}
        {answers.activity === 'eat' && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-pink-600">
              What shall we eat?
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {eatOptions.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-lg shadow-md overflow-hidden text-left ${
                    answers.food[0] === item.name
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-pink-600'
                  }`}
                  onClick={() => setAnswers({ ...answers, food: [item.name] })}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />

                  <div className="p-4">
                    <div className="font-bold text-lg">{item.name}</div>
                    <div className="text-sm opacity-80 mt-1">
                      📍 {item.address}
                    </div>

                    <a
                      href={item.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-2 text-sm underline font-semibold"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* 🎬 MOVIE */}
        {answers.activity === 'movie' && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-pink-600">
              Which cinema shall we go to?
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {movieOptions.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-lg shadow-md overflow-hidden text-left ${
                    answers.movie === item.name
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-pink-600'
                  }`}
                  onClick={() => setAnswers({ ...answers, movie: item.name })}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />

                  <div className="p-4">
                    <div className="font-bold text-lg">{item.name}</div>
                    <div className="text-sm opacity-80 mt-1">
                      📍 {item.address}
                    </div>

                    <a
                      href={item.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-2 text-sm underline font-semibold"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* ☕ COFFEE */}
        {answers.activity === 'coffee' && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-pink-600">
              Which café shall we visit?
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {coffeeOptions.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-lg shadow-md overflow-hidden text-left ${
                    answers.movie === item.name
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-pink-600'
                  }`}
                  onClick={() => setAnswers({ ...answers, movie: item.name })}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />

                  <div className="p-4">
                    <div className="font-bold text-lg">{item.name}</div>
                    <div className="text-sm opacity-80 mt-1">
                      📍 {item.address}
                    </div>

                    <a
                      href={item.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-2 text-sm underline font-semibold"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* ✅ BUTTON CUỐI */}
        {answers.activity && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-pink-600">
              {activityContent[answers.activity].title}
            </h2>

            <p className="text-pink-500">
              {activityContent[answers.activity].description}
            </p>

            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                answers.activity === 'eat'
                  ? answers.food.length !== 1
                  : !answers.movie
              }
              className="mt-6 bg-pink-500 text-white rounded-full px-6 py-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activityContent[answers.activity].button}
            </Button>
          </>
        )}
      </motion.div>
    </motion.div>,

    // Step 4: Excitement Rating
    <motion.div key="step4" className="text-center" {...fadeInUp}>
      <h2 className="text-3xl font-bold mb-6 text-pink-600">
        How are you feeling about this plan?
      </h2>

      <div className="max-w-md mx-auto mb-6 p-4 bg-white rounded-lg shadow-lg">
        <motion.div className="relative h-6 mb-4">
          {[80, 85, 90, 95, 100].map((value) => (
            <motion.div
              key={value}
              className="absolute top-0 w-6 h-6 rounded-full bg-pink-300"
              style={{
                left: `${((value - 80) / 20) * 100}%`, // 🔥 CHUẨN 80–100
                x: '-50%',
              }}
              animate={{ scale: answers.excitement === value ? 1.2 : 1 }}
            />
          ))}
        </motion.div>

        <Slider
          value={[Math.max(answers.excitement, 60)]}
          min={60}
          max={100}
          step={5}
          onValueChange={(value) => {
            const next = Math.max(value[0], 60)
            setAnswers({ ...answers, excitement: next })
          }}
        />

        <div className="flex justify-between mt-2 text-sm text-pink-400">
          <span>Sounds okay</span>
          <span>Sounds really good</span>
        </div>
      </div>
      <motion.div
        className="text-2xl font-bold text-pink-600 mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        Excitement level: {answers.excitement}%
      </motion.div>
      <Button
        onClick={() => {
          setStep(step + 1)
          setTimeout(triggerConfetti, 500)
        }}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
      >
        Let&apos;s make it official!
      </Button>
    </motion.div>,

    // Step 5: Final Message
    <motion.div key="step5" className="text-center" {...fadeInUp}>
      <h2 className="text-4xl font-bold mb-6 text-pink-600">
        It&apos;s a plan ✨
      </h2>
      <p className="text-xl mb-2 text-pink-500">
        I&apos;m looking forward to seeing you on:
      </p>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://media.tenor.com/yvUCU981VYoAAAAj/mochi-cat-goma.gif"
        alt="Excited bear gif"
        className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg"
      />{' '}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Star className="text-yellow-400 w-16 h-16 mx-auto mt-6" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-6 text-lg text-pink-500"
      >
        {answers.activity === 'eat' && (
          <p>
            We&apos;ll enjoy a delicious meal at{' '}
            <span className="font-bold text-pink-600">{answers.food[0]}</span>.
          </p>
        )}

        {answers.activity === 'movie' && (
          <p>
            Then we&apos;ll have a lovely movie night at{' '}
            <span className="font-bold text-pink-600">{answers.movie}</span>.
          </p>
        )}

        {answers.activity === 'coffee' && (
          <p>
            We&apos;ll relax together at{' '}
            <span className="font-bold text-pink-600">{answers.movie}</span>{' '}
            with some coffee ☕
          </p>
        )}

        <p className="mt-4 font-bold">
          Your excitement level: {answers.excitement}/100 💕
        </p>
      </motion.div>
    </motion.div>,
  ]

  useEffect(() => {
    const saveAnswers = async () => {
      console.log('Saved answers:', answers)

      // Save to localStorage
      localStorage.setItem('dateProposalAnswers', JSON.stringify(answers))

      // Send to your email
      try {
        await fetch('/api/send-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        })
      } catch (error) {
        console.error('Failed to send response:', error)
      }
    }

    if (step === steps.length - 1) {
      saveAnswers()
    }
  }, [step, answers, steps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <HeartBackground />
      </Suspense>
      <motion.div
        className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
      </motion.div>
    </div>
  )
}
