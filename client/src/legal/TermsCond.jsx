import React from 'react'

const TermsCond = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="berkshireSwashFont text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions for OTW Pizza
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            <strong>Last Updated:</strong> December 15, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Acceptance of Terms */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Acceptance of Terms</h2>
            <p className="text-blue-800 leading-relaxed">
              By accessing and using the OTW Pizza website (otwpizza.com) or mobile application ("Service"), 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Use License</h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 mb-3">
                  <strong>Permission is granted</strong> to temporarily download one copy of OTW Pizza materials 
                  for personal, non-commercial transitory viewing only.
                </p>
              </div>

              <div>
                <p className="text-gray-700 mb-3">
                  <strong>This is the grant of a license, not a transfer of title</strong>, and under this license you may not:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    modify or copy the materials
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    use the materials for any commercial purpose or for any public display
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    attempt to decompile or reverse engineer any software contained on the website
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    remove any copyright or other proprietary notations from the materials
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>This license shall automatically terminate</strong> if you violate any of these restrictions 
                  and may be terminated by OTW Pizza at any time.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Description</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Pizza Ordering Service
                </h3>
                <ul className="space-y-2 text-orange-800 text-sm">
                  <li>• OTW Pizza provides an online platform for ordering pizza for pickup</li>
                  <li>• We reserve the right to refuse or cancel any order at our discretion</li>
                  <li>• All orders are subject to availability</li>
                  <li>• Menu items, prices, and availability are subject to change without notice</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Account Requirements
                </h3>
                <ul className="space-y-2 text-purple-800 text-sm">
                  <li>• You must provide accurate and complete information when placing orders</li>
                  <li>• You are responsible for maintaining the confidentiality of your order information</li>
                  <li>• You must be at least 13 years old to use this service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Order Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Terms</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">$</span>
                  Pricing and Payment
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-2 text-gray-700">
                    <li>• All prices are listed in USD and are subject to change without notice</li>
                    <li>• Payment is processed securely through Square payment systems</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li>• You authorize us to charge your payment method for all orders placed</li>
                    <li>• Additional fees may apply and will be clearly displayed before order completion</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">📍</span>
                  Pickup
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Pickup times are estimates and may vary based on order volume and preparation time</li>
                    <li>• You will be notified when your order is ready for pickup</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Pickup orders must be collected within reasonable timeframes from our location</li>
                    <li>• Please bring your order confirmation or ID when collecting your order</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-600 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">✏️</span>
                  Order Modifications and Cancellations
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Orders can only be modified or cancelled within a short window after placement</li>
                  <li>• Cancellation policies depend on order status and preparation time</li>
                  <li>• Refunds will be processed according to our refund policy outlined below</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund and Return Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund and Return Policy</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Eligible Refunds
                </h3>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• Incorrect orders due to our error</li>
                  <li>• Food quality issues reported promptly</li>
                  <li>• Orders not ready within reasonable time due to our error</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refund Process
                </h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Contact us immediately for food quality or service issues</li>
                  <li>• Refunds processed to original payment method within 5-7 business days</li>
                  <li>• We reserve the right to investigate refund claims</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Non-Refundable
                </h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Customer failure to pick up orders within specified timeframes</li>
                  <li>• Orders cancelled after preparation has begun</li>
                  <li>• Order delays due to circumstances beyond our control</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Accurate Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">Provide correct contact information for pickup notifications</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">Ensure you can pick up orders within the specified timeframes</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">Notify us promptly of any allergies or dietary restrictions</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">Prohibited Uses</h3>
                <p className="text-red-800 text-sm mb-3">You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts, including but not limited to:</p>
                <ul className="space-y-1 text-red-800 text-sm">
                  <li>• Fraudulent activities</li>
                  <li>• Harassment of staff</li>
                  <li>• Violating any local, state, national, or international law</li>
                  <li>• Transmitting copyrighted material without permission</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-3">Food Allergies and Dietary Restrictions</h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li>• You are responsible for informing us of any allergies or dietary restrictions</li>
                <li>• We cannot guarantee that our food is free from allergens</li>
                <li>• Cross-contamination may occur in our kitchen facilities</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Availability</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• We do not warrant that the service will be uninterrupted or error-free</li>
                  <li>• We reserve the right to modify or discontinue the service at any time</li>
                  <li>• Temporary interruptions may occur due to maintenance or technical issues</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Liability Limitations</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Our liability is limited to the cost of your order</li>
                  <li>• We are not responsible for indirect, incidental, or consequential damages</li>
                  <li>• We are not liable for damages resulting from food allergies if not properly disclosed</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Force Majeure</h3>
                <p className="text-purple-800 text-sm mb-2">We are not responsible for delays or failures resulting from acts beyond our reasonable control:</p>
                <ul className="space-y-1 text-purple-800 text-sm">
                  <li>• Natural disasters</li>
                  <li>• Government actions</li>
                  <li>• Labor disputes</li>
                  <li>• Technical failures</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mobile Application Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mobile Application Terms</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">App Store Compliance</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Downloads from app stores are subject to the respective store's terms</li>
                  <li>• We are not responsible for app store policies or changes</li>
                  <li>• App functionality may vary by device and operating system</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Permissions</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• The app may request permissions necessary for ordering and pickup notifications</li>
                  <li>• Push notifications may be used for order status updates</li>
                  <li>• You may manage permissions through your device settings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Age Restrictions & CCPA */}
          <section>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Restrictions</h2>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <ul className="space-y-2 text-orange-800 text-sm">
                    <li><strong>Minimum Age:</strong> Users must be at least 13 years old to use our service</li>
                    <li><strong>Under 18:</strong> Users under 18 must have parental consent</li>
                    <li><strong>Parental Responsibility:</strong> Parents are responsible for monitoring their minor children's use and are financially responsible for orders placed by minors</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ol className="space-y-2 text-red-800 text-sm">
                    <li><strong>1. Direct Communication:</strong> Contact us first to resolve any disputes</li>
                    <li><strong>2. Mediation:</strong> If direct resolution fails, disputes may be submitted to mediation</li>
                    <li><strong>3. Arbitration:</strong> Binding arbitration may be required for unresolved disputes</li>
                    <li><strong>4. Class Action Waiver:</strong> You agree to resolve disputes individually, not as part of a class action</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Customer Service</h3>
                <div className="space-y-2 text-blue-800 text-sm">
                  <p><strong>Email:</strong> support@otwpizza.com</p>
                  <p><strong>Phone:</strong> Contact through website form</p>
                  <p><strong>Website:</strong> otwpizza.com</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Legal Questions</h3>
                <p className="text-green-800 text-sm">
                  For questions about these terms, contact us using the information above with 
                  "Legal Inquiry" in the subject line.
                </p>
              </div>
            </div>
          </section>

          {/* Final Notes */}
          <section className="bg-gray-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-6">Important Legal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-lg font-semibold mb-3">Modifications to Terms</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• We reserve the right to modify these terms at any time</li>
                  <li>• Changes will be posted with an updated "Last Updated" date</li>
                  <li>• Continued use after changes constitutes acceptance</li>
                  <li>• Material changes may receive additional notification</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Legal Framework</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Severability:</strong> Invalid provisions don't affect the rest</li>
                  <li>• <strong>Entire Agreement:</strong> These terms plus Privacy Policy constitute full agreement</li>
                  <li>• <strong>Limitation Period:</strong> Claims must be brought within one (1) year</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 mt-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>By using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</strong>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default TermsCond