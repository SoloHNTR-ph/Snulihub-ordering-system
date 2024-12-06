import { Link } from 'react-router-dom'

const featuredProduct = {
  id: 1,
  name: 'Featured Product',
  price: 199.99,
  description: 'Our most popular premium product with exclusive features.',
  image: 'https://via.placeholder.com/400',
};

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Featured Product */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Hero Content */}
            <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:w-1/2 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl fade-in-up">
                    <span className="block xl:inline">Discover the best</span>{' '}
                    <span className="block text-primary-600 xl:inline">deals today</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 fade-in-up stagger-delay-1">
                    Shop our exclusive collection of premium products and enjoy unbeatable prices.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start fade-in-up stagger-delay-2">
                    <div className="rounded-md shadow">
                      <Link
                        to="/checkout"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 hover:-translate-y-1 md:py-4 md:text-lg md:px-10"
                      >
                        Proceed Order
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
            
            {/* Featured Product */}
            <div className="lg:w-1/2 p-8 fade-in-right">
              <div className="bg-white rounded-lg shadow-lg p-6 hover-lift">
                <h2 className="text-2xl font-bold mb-4">Featured Product</h2>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-semibold">{featuredProduct.name}</h3>
                <p className="mt-2 text-gray-600">{featuredProduct.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary-600">${featuredProduct.price}</p>
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all duration-300 hover:-translate-y-1">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card relative">
              <img className="h-48 w-full object-cover" src="https://via.placeholder.com/400" alt="Category 1" />
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">Category 1</h3>
              </div>
            </div>
            <div className="card relative">
              <img className="h-48 w-full object-cover" src="https://via.placeholder.com/400" alt="Category 2" />
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">Category 2</h3>
              </div>
            </div>
            <div className="card relative">
              <img className="h-48 w-full object-cover" src="https://via.placeholder.com/400" alt="Category 3" />
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">Category 3</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-primary-800">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 12a1 1 0 100-2 1 1 0 000 2zm-7 8a1 1 0 001-1V6a1 1 0 00-1-1H1a1 1 0 00-1 1v13a1 1 0 001 1h1zm16-1a1 1 0 001-1V6a1 1 0 00-1-1h-1a1 1 0 00-1 1v13a1 1 0 001 1h1zM8 3a1 1 0 011-1h2a1 1 0 011 1v1h-4V3zm-3 1V3a3 3 0 013-3h2a3 3 0 013 3v1h1a3 3 0 013 3v13a3 3 0 01-3 3H4a3 3 0 01-3-3V7a3 3 0 013-3h1z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">We have a special offer just for you!</span>
                <span className="hidden md:inline">Don't miss out on our exclusive deals and discounts!</span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <Link
                to="/promotions"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
