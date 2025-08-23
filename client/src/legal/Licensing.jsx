

const Licensing = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="berkshireSwashFont text-4xl font-bold text-gray-900 mb-4">
            Credits & Acknowledgments
          </h1>
          <p className="text-gray-600 text-lg">
            We'd like to acknowledge the amazing tools and resources that help make OTW Pizza possible.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Technology Stack */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">⚛️</span>
                  Frontend Framework
                </h3>
                <div className="space-y-2 text-blue-800 text-sm">
                  <p><strong>React</strong> - A JavaScript library for building user interfaces</p>
                  <p><strong>License:</strong> MIT License</p>
                  <p><strong>Website:</strong> <a href="https://reactjs.org" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">reactjs.org</a></p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">💳</span>
                  Payment Processing
                </h3>
                <div className="space-y-2 text-green-800 text-sm">
                  <p><strong>Square</strong> - Secure payment processing platform</p>
                  <p><strong>Security:</strong> PCI DSS Level 1 compliant</p>
                  <p><strong>Website:</strong> <a href="https://squareup.com" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">squareup.com</a></p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">🎨</span>
                  Styling & Design
                </h3>
                <div className="space-y-2 text-purple-800 text-sm">
                  <p><strong>Tailwind CSS</strong> - A utility-first CSS framework</p>
                  <p><strong>License:</strong> MIT License</p>
                  <p><strong>Website:</strong> <a href="https://tailwindcss.com" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">tailwindcss.com</a></p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">📊</span>
                  Database & Backend
                </h3>
                <div className="space-y-2 text-orange-800 text-sm">
                  <p><strong>MongoDB</strong> - Document database for modern applications</p>
                  <p><strong>Node.js</strong> - JavaScript runtime for server-side development</p>
                  <p><strong>Express.js</strong> - Web framework for Node.js</p>
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Typography</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-yellow-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">Aa</span>
                Google Fonts
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-yellow-800 text-sm mb-2">We use beautiful, free fonts from Google Fonts:</p>
                  <ul className="space-y-1 text-yellow-800 text-sm ml-4">
                    <li>• <strong>Berkshire Swash</strong> - For elegant headings</li>
                    <li>• <strong>Charm</strong> - For decorative text</li>
                    <li>• <strong>Barriecito</strong> - For special styling</li>
                    <li>• <strong>Bentham</strong> - For readable body text</li>
                  </ul>
                </div>
                <div>
                  <p className="text-yellow-800 text-sm"><strong>License:</strong> Open Font License (OFL)</p>
                  <p className="text-yellow-800 text-sm"><strong>Usage:</strong> Free for commercial use</p>
                  <p className="text-yellow-800 text-sm"><strong>Website:</strong> <a href="https://fonts.google.com" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">fonts.google.com</a></p>
                </div>
              </div>
            </div>
          </section>

          {/* Development Tools */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Development & Tools</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Build Tools</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Vite</strong> - Fast build tool</li>
                  <li>• <strong>ESLint</strong> - Code quality</li>
                  <li>• <strong>PostCSS</strong> - CSS processing</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">State Management</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Redux Toolkit</strong> - State management</li>
                  <li>• <strong>React Router</strong> - Navigation</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Email Service</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>SendGrid</strong> - Email delivery</li>
                  <li>• <strong>Google Workspace</strong> - Business email</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Special Thanks */}
          <section className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Thanks</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-4">
                We're grateful to the open-source community and all the developers who create amazing tools that make modern web development possible. 
                Every pizza you order is powered by the collaborative spirit of thousands of developers worldwide.
              </p>
              <div className="flex justify-center items-center space-x-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🍕</div>
                  <p className="text-sm text-gray-600">Made with love</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm text-gray-600">Powered by technology</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🌟</div>
                  <p className="text-sm text-gray-600">Inspired by community</p>
                </div>
              </div>
            </div>
          </section>

          {/* Copyright Notice */}
          <section className="bg-gray-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Copyright & Trademark Notice</h2>
            <div className="space-y-3 text-gray-300">
              <p>© 2025 OverTheWall™ Pizza. All rights reserved.</p>
              <p className="text-sm">
                "OTW Pizza," our logo, and all related branding materials are trademarks of OverTheWall Pizza. 
                All other trademarks are the property of their respective owners.
              </p>
              <p className="text-sm">
                This website and its content are protected by copyright and other intellectual property laws.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default Licensing