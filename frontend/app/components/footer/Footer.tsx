"use client"
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function Footer() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <footer className="mt-10 bg-slate-800 text-white">
      <div className="max-w-[1500px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/Untitled-1.png" 
                alt="Adhreline" 
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Adventure lives within you—unleash it! Discover epic destinations and thrilling experiences through these. The world is yours to conquer, and we're your guide to the boldest adventures. Start booking away!
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Activities</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Skydiving</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bungee Jumping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hiking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Go Kart Racing</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">Turf Booking</a></li> */}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a onClick={() => router.push(`/blogs`)} className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Email: contact@adhreline.com</p>
              {/* <p>Phone: 123-456-7890</p> */}
              <p>Hours: Mon-Fri 9:30AM - 6:00PM</p>
            </div>
            
            {/* Newsletter Signup */}
            <form onSubmit={handleSubscribe} className="space-y-3 mt-4">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-r-lg hover:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 All Rights Reserved. Adhreline
          </p>
        </div>
      </div>
    </footer>
  )
}
