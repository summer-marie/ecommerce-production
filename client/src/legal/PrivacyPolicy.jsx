

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="berkshireSwashFont text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy for OTW Pizza
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            <strong>Last Updated:</strong> December 15, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              OTW Pizza ("we," "our," or "us") operates a pizza ordering website at otwpizza.com. 
              This Privacy Policy explains how we collect, use, share, and protect your personal 
              information when you use our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer Information</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li><strong>Contact Details:</strong> Name, email address, phone number</li>
                  <li><strong>Delivery Information:</strong> Street address, city, state, zip code</li>
                  <li><strong>Order Details:</strong> Pizza selections, quantities, special instructions, order preferences</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Payment Information</h3>
                <p className="text-blue-800">
                  We use Square (Square, Inc.) as our secure payment processor. <strong>We do not store, 
                  process, or have access to your credit card information.</strong> Square handles all 
                  payment data securely and in compliance with PCI DSS standards.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li><strong>Browser Information:</strong> IP address, user agent, browser type and version</li>
                  <li><strong>Performance Data:</strong> Response times, error logs, and basic usage metrics for service optimization</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Communication Data</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li><strong>Contact Form Messages:</strong> Name, email, phone, message content when you contact us</li>
                  <li><strong>Support Interactions:</strong> Records of customer service communications</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Order Processing</h3>
                <ul className="space-y-1 text-green-800 text-sm">
                  <li>• Process and fulfill your pizza orders</li>
                  <li>• Communicate order status and delivery updates</li>
                  <li>• Handle customer service inquiries</li>
                  <li>• Send order confirmations and receipts</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Business Operations</h3>
                <ul className="space-y-1 text-yellow-800 text-sm">
                  <li>• Maintain accurate business records</li>
                  <li>• Analyze service performance and reliability</li>
                  <li>• Prevent fraud and ensure security</li>
                  <li>• Comply with legal and tax requirements</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Communication</h3>
                <ul className="space-y-1 text-purple-800 text-sm">
                  <li>• Respond to customer inquiries and support requests</li>
                  <li>• Send important service-related notifications</li>
                  <li>• Provide order updates and delivery information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">S</span>
                  Square Payment Processing
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>What they do:</strong> Secure payment processing for all transactions</p>
                    <p><strong>Data shared:</strong> Payment amount, transaction details (no customer personal data is shared by us)</p>
                  </div>
                  <div>
                    <p><strong>Security:</strong> Square is PCI DSS compliant and handles all payment card data securely</p>
                    <p><strong>Their privacy policy:</strong> <a href="https://squareup.com/legal/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">squareup.com/legal/privacy</a></p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-red-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">SG</span>
                  SendGrid Email Service
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>What they do:</strong> Deliver transactional emails (order confirmations, receipts)</p>
                    <p><strong>Data shared:</strong> Customer email addresses, order confirmation content</p>
                  </div>
                  <div>
                    <p><strong>Usage:</strong> Only for essential business communications</p>
                    <p><strong>Their privacy policy:</strong> <a href="https://www.twilio.com/legal/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">twilio.com/legal/privacy</a></p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">G</span>
                  Google Workspace
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>What they do:</strong> Professional email services for our business communications</p>
                    <p><strong>Data shared:</strong> Customer messages sent to our support email addresses</p>
                  </div>
                  <div>
                    <p><strong>Their privacy policy:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Security Measures</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Encryption</p>
                      <p className="text-gray-600 text-sm">All data transmissions use SSL/TLS encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Rate Limiting</p>
                      <p className="text-gray-600 text-sm">Protection against automated attacks and abuse</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Input Sanitization</p>
                      <p className="text-gray-600 text-sm">All user inputs are sanitized to prevent security vulnerabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Security Headers</p>
                      <p className="text-gray-600 text-sm">Advanced security headers including CSP, HSTS, and XSS protection</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">Payment Security</h3>
                <div className="space-y-3 text-red-800">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-medium">No Card Data Storage</p>
                  </div>
                  <p className="text-sm ml-7">We never store credit card information</p>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-medium">Square Security</p>
                  </div>
                  <p className="text-sm ml-7">All payment processing handled by Square's secure, PCI-compliant systems</p>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-medium">Tokenization</p>
                  </div>
                  <p className="text-sm ml-7">Payment methods are tokenized by Square for security</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Order Information</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• <strong>Active Orders:</strong> Retained until order completion and delivery</li>
                  <li>• <strong>Archived Orders:</strong> Kept for business and tax compliance purposes</li>
                  <li>• <strong>Automatic Cleanup:</strong> Orders older than 30 days after archiving are automatically deleted</li>
                  <li>• <strong>Tax Compliance:</strong> Important records may be retained longer as required by law</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Contact Messages</h3>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• <strong>Customer Messages:</strong> Automatically deleted after 30 days from our database</li>
                  <li>• <strong>Email Backup:</strong> Original emails remain in our business email system</li>
                  <li>• <strong>Storage Limit:</strong> Maximum 100 messages in our system (oldest removed when limit reached)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Local Storage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies and Local Storage</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Customer Experience</h3>
              <div className="space-y-3 text-green-800">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium">No Customer Cookies</p>
                    <p className="text-sm">Regular customers browse our site without any persistent cookies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium">Session Storage</p>
                    <p className="text-sm">Temporary order information stored locally in browser until order completion</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium">No Tracking</p>
                    <p className="text-sm">We do not use cookies for tracking or advertising purposes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Access and Control</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <p className="font-medium">Data Access</p>
                      <p className="text-sm">Contact us to request information about data we have collected about you</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <p className="font-medium">Correction</p>
                      <p className="text-sm">Request correction of inaccurate personal information</p>
                    </div>
                  </li>
                </ul>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <p className="font-medium">Deletion</p>
                      <p className="text-sm">Request deletion of your personal information (subject to business and legal requirements)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <p className="font-medium">Communication Preferences</p>
                      <p className="text-sm">Opt out of non-essential communications</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="text-gray-600 text-sm">
                  <strong>Automated Decision Making:</strong> We do not use automated decision-making or profiling systems that significantly impact customers.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy & CCPA */}
          <section>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">California Privacy Rights (CCPA)</h2>
                <p className="text-gray-700 text-sm mb-3">California residents have additional rights under the California Consumer Privacy Act:</p>
                <ul className="space-y-1 text-gray-700 text-sm ml-4">
                  <li>• Right to know what personal information is collected</li>
                  <li>• Right to delete personal information</li>
                  <li>• Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                  <li>• Right to non-discrimination for exercising privacy rights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">For Privacy-Related Questions:</h3>
                <div className="space-y-2 text-blue-800 text-sm">
                  <p><strong>Email:</strong> support@otwpizza.com</p>
                  <p><strong>Phone:</strong> Contact us through our website contact form</p>
                  <p><strong>Address:</strong> Contact us for our business mailing address</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">For General Inquiries:</h3>
                <div className="space-y-2 text-green-800 text-sm">
                  <p><strong>Business Email:</strong> support@otwpizza.com</p>
                  <p><strong>Website:</strong> otwpizza.com</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Notes */}
          <section className="bg-gray-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Changes to This Policy</h2>
            <p className="mb-6 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of any material changes by posting 
              the new policy on our website with an updated "Last Updated" date.
            </p>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-3">Compliance Statement</h3>
              <p className="text-gray-300 leading-relaxed">
                This privacy policy complies with applicable privacy laws including CCPA and general best practices. 
                We are committed to protecting your privacy and handling your personal information responsibly.
              </p>
            </div>
          </section>

          {/* Footer Message */}
          <div className="text-center border-t border-gray-200 pt-8">
            <p className="text-gray-600 italic">
              This privacy policy is designed to be transparent about our data practices. We collect only 
              the information necessary to provide our pizza delivery service and protect your privacy at every step.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy