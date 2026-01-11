"use client"

import { useState } from 'react'

interface Adventure {
  id: string
  title: string
  location: string
  originalPrice?: number
  currentPrice: number
  rating: number
  image: string
  isFavorite?: boolean
}

const adventures: Adventure[] = [
  {
    id: '1',
    title: 'Paragliding',
    location: 'Puri',
    currentPrice: 3850,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '2',
    title: 'Rafting',
    location: 'Uttarakhand',
    originalPrice: 3000,
    currentPrice: 600,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '3',
    title: 'Kayaking',
    location: 'Kerala',
    currentPrice: 1500,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '4',
    title: 'Desert Safari',
    location: 'Jaisalmer',
    currentPrice: 3000,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '5',
    title: 'Hot Air Balloon',
    location: 'Jaipur',
    currentPrice: 8000,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '6',
    title: 'Bike Riding',
    location: 'Manali',
    currentPrice: 29999,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '7',
    title: 'Scuba Diving',
    location: 'Andaman',
    currentPrice: 3850,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '8',
    title: 'Go Kart',
    location: 'Bangalore',
    currentPrice: 3850,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '9',
    title: 'Hiking',
    location: 'Himachal',
    currentPrice: 35000,
    rating: 4,
    image: '/beach_1.jpg',
  },
  {
    id: '10',
    title: 'Peak Climbing',
    location: 'Nepal',
    currentPrice: 30000,
    rating: 4,
    image: '/beach_1.jpg',
  },
]

export function PopularActivities() {
  const [showAll, setShowAll] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const displayedAdventures = showAll ? adventures : adventures.slice(0, 10)

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <section className="w-full bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Activities</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayedAdventures.map((adventure) => {
          const discountPercentage = adventure.originalPrice && adventure.originalPrice !== adventure.currentPrice
            ? Math.round(((adventure.originalPrice - adventure.currentPrice) / adventure.originalPrice) * 100)
            : 0
          
          return (
            <div
              key={adventure.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={adventure.image}
                  alt={adventure.title}
                  className="w-full h-48 object-cover"
                />

                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {adventure.rating.toFixed(1)}
                </div>                
              </div>

              <div className="p-4">
                <div className='flex'>
                  <h3 className="font-semibold text-gray-900 text-l mb-1">{adventure.title}</h3>
                  <p className="text-gray-600 mb-3 flex items-center gap-1">
                    <span className="text-gray-500">•</span>
                    <span className='text-l'>20 min</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-l font-semibold text-gray-900">
                      ₹{adventure.currentPrice.toLocaleString()}
                    </span>
                    {adventure.originalPrice && adventure.originalPrice !== adventure.currentPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ₹{adventure.originalPrice.toLocaleString()}
                        </span>
                        <span className="bg-[#EF4444] text-white px-2 py-1 rounded text-sm font-medium">
                          {discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-[#EF4444] text-sm text-white py-3 px-4 rounded-3xl hover:bg-red-600 transition-colors duration-200">
                    Book Activity
                  </button>
                  <button
                    onClick={() => toggleFavorite(adventure.id)}
                    className="p-3 border border-gray-200 rounded-3xl hover:border-gray-300 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        favorites.has(adventure.id) ? 'text-[#EF4444] fill-current' : 'text-gray-400'
                      }`}
                      fill={favorites.has(adventure.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* {!showAll && adventures.length > 10 && ( */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Show more options
          </button>
        </div>
      {/* // )} */}
    </section>
  )
}
