import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../redux/messageSlice";

const Contact = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("support@otwpizza.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy email:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = "support@otwpizza.com";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.subject || !formData.message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    console.log("handle submit called with formData:", formData);

    setIsLoading(true);
    try {
      const result = await dispatch(sendMessage(formData)).unwrap();
      console.log("Message sent successfully:", result);

      setFormData({
        email: "",
        subject: "",
        message: "",
      });
      alert("Message sent successfully!");
    } catch (err) {
      console.error("Send message failed:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section id="contactSection" className="min-h-screen flex items-center">
        <div className="py-8 lg:py-16 mx-auto max-w-screen-md w-full min-h-full">
          <h2 className="mb-4 text-3xl sm:text-4xl tracking-tight font-extrabold text-center text-slate-800">
            Contact Us
          </h2>

          <p className="mb-8 lg:mb-16 text-center text-gray-700 text-base sm:text-xl leading-relaxed px-2">
            We're a family-owned pizzeria dedicated to crafting the perfect
            slice right here in Goodyear, Arizona. Whether you have questions
            about our menu, want to share your dining experience, or need
            assistance with your order, we're here to help! Our team values
            every customer and looks forward to serving you the best pizza in
            town.
          </p>
          
          {/* Contact Info */}
          <div className="mb-8 lg:mb-12 text-center">
            <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur rounded-xl px-6 py-4 shadow-lg border border-gray-200">
              <svg 
                className="w-10 h-10 text-teal-600 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="flex-grow">
                <p className="text-sm text-gray-600 mb-1 text-left">Email us directly at:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-semibold text-teal-700 select-all">
                    support@otwpizza.com
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                      copied 
                        ? 'bg-green-100 border-green-300 text-green-700' 
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Copy email address"
                  >
                    {copied ? (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-red-600 italic text-base sm:text-lg mb-6">
            ** All fields are required
          </p>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your message
              </label>
              <textarea
                rows="6"
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Leave a comment..."
                required
              ></textarea>
            </div>

            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-[60%] md:w-[40%] lg:w-[30%] font-medium cursor-pointer
              shadow-green-800/80 
              text-slate-800 
              from-green-300
              via-green-500 
              to-green-600
              focus:ring-green-800 rounded-lg shadow-lg text-sm px-5 py-3 text-center me-2 mb-2 hover:bg-gradient-to-br bg-gradient-to-t focus:ring-4 focus:outline-none"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
