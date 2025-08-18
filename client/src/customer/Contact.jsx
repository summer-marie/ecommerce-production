import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../redux/messageSlice";

const Contact = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

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
      <section id="contactSection" className="bg-grey-400 mb-20 px-4">
        <div className="py-8 lg:py-16 mx-auto max-w-screen-md">
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
