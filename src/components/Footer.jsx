import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t w-full">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary-600">SnuliHub Store</h3>
            <p className="text-gray-500">Your premium shopping destination for quality products.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-500 hover:text-primary-600">Cart</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary-600">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary-600">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary-600">Returns & Exchanges</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Newsletter</h3>
            <p className="text-gray-500">Subscribe to receive updates and special offers.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
              />
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500"> 2024 SnuliHub Store. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-600">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
