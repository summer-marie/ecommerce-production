import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessages,
  updateMessageRead,
  deleteMessage,
} from "../redux/messageSlice";

const AdminInbox = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.message);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { show: boolean, title: string, message: string }

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      dispatch(updateMessageRead(msg.id));
    }
  };

  const handleReply = () => {
    const email = selected?.email;
    // Simulate send, then show toast
    setToast({ show: true, title: "Reply sent", message: `Sent to ${email}` });

    // Auto-hide toast
    setTimeout(() => setToast((t) => (t ? { ...t, show: false } : t)), 2400);
    setTimeout(() => setToast(null), 3000);

    setReply("");
    // clear selection after reply
    setSelected(null);
  };

  // handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  // handle delete selected messages
  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    
    try {
      // Delete each selected message
      await Promise.all(
        selectedMessages.map((id) => dispatch(deleteMessage(id)).unwrap())
      );

      // Clear selection and reset selected message if it was deleted
      setSelectedMessages([]);
      if (selected && selectedMessages.includes(selected.id)) {
        setSelected(null);
        setReply("");
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Sort messages to show unread first
  const sortedMessages = [...messages].sort((a, b) => {
    // Sort by read status first (unread messages first)
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    // Then sort by date (newest first)
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[60] w-[22rem] max-w-sm transform transition-all duration-300 ${
            toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-xl bg-slate-900/90 text-slate-50 shadow-xl ring-1 ring-sky-400/30 backdrop-blur-md">
            <div className="flex items-start gap-3 p-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1.293 12.293-2.5-2.5 1.414-1.414L10.707 11.5l4.672-4.672 1.414 1.414-6.086 6.05Z" />
                </svg>
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{toast.title}</div>
                <div className="text-xs text-slate-300">{toast.message}</div>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="-m-1 rounded-md p-1 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                aria-label="Dismiss notification"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811Z" />
                </svg>
              </button>
            </div>
            <div className="h-1 w-full bg-slate-700/60">
              <div className="h-1 w-full bg-sky-400/80 animate-[shrink_3s_linear_forwards]"></div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4">
        {/* Message Policy Header */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 mt-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Message Retention Policy</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p>• <strong>Automatic cleanup:</strong> Messages older than 30 days are automatically deleted from this dashboard</p>
                <p>• <strong>Storage limit:</strong> Maximum 100 messages stored (oldest removed when limit reached)</p>
                <p>• <strong>Email backup:</strong> All original emails remain permanently in your Gmail inbox</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Message List */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-700">
                Inbox
                <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Unread {messages.filter((msg) => !msg.isRead).length}
                </span>
                <span className="ml-2 bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Read {messages.filter((msg) => msg.isRead).length}
                </span>
              </h2>

              {/* Delete button - only show when messages are selected */}
              {selectedMessages.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-200 flex items-center ${
                    isDeleting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 hover:shadow-lg"
                  }`}
                  title="Remove from dashboard (emails remain in Gmail)"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Removing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove ({selectedMessages.length})
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Info note about delete behavior */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div className="text-xs text-blue-800">
                  <strong>Note:</strong> Removing messages here only clears them from this dashboard. 
                  Original emails remain safely stored in your Gmail inbox for permanent reference.
                </div>
              </div>
            </div>

            {loading && <div className="text-gray-500">Loading...</div>}
            <ul className="overflow-y-auto pr-1 flex-1 max-h-[calc(90vh-100px)]">
              {messages.length === 0 && (
                <li className="text-gray-400">No messages yet.</li>
              )}
              {sortedMessages.map((msg) => (
                <li
                  key={msg.id}
                  className={`p-3 mb-2 rounded cursor-pointer border flex items-center ${
                    selected?.id === msg.id
                      ? "bg-slate-100 border-slate-700"
                      : msg.isRead
                      ? "bg-gray-100 border-gray-300"
                      : "bg-yellow-50 border-yellow-400"
                  }`}
                >
                  {/* Checkbox for selection */}
                  <input
                    type="checkbox"
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={selectedMessages.includes(msg.id)}
                    onChange={() => handleCheckboxChange(msg.id)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Message content */}
                  <div className="flex-1" onClick={() => handleSelect(msg)}>
                    <div className="font-semibold">{msg.subject}</div>
                    <div className="text-xs text-gray-500">{msg.email}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(msg.date).toLocaleString()}
                    </div>
                    {!msg.isRead && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-yellow-300 text-yellow-900 rounded">
                        New
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Message Detail & Reply - MOVED OUTSIDE the message list div */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            {selected ? (
              <>
                <div className="mb-4">
                  <div className="text-lg font-bold">{selected.subject}</div>
                  <div className="text-sm text-gray-500">{selected.email}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    {new Date(selected.date).toLocaleString()}
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 mb-4">
                    {selected.message}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Reply to customer
                  </label>
                  <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                  ></textarea>
                  <button
                    className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition"
                    onClick={handleReply}
                  >
                    Send Reply
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-400 flex items-center h-full">
                Select a message to read and reply.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminInbox;
