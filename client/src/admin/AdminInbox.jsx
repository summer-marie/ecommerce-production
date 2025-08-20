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
    alert(`Reply sent to ${selected.email}:\n\n${reply}`);
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
  const handleDeleteSelected = () => {
    if (
      window.confirm(
        `Remove ${selectedMessages.length} selected messages from dashboard?\n\n` +
        `Note: This only removes messages from this admin panel. ` +
        `Original emails will remain in your Gmail inbox.`
      )
    ) {
      // Delete each selected message
      selectedMessages.forEach((id) => {
        dispatch(deleteMessage(id));
      });

      // Clear selection and reset selected message if it was deleted
      setSelectedMessages([]);
      if (selected && selectedMessages.includes(selected.id)) {
        setSelected(null);
        setReply("");
      }
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
      <div className="ml-64 px-4">
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
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition flex items-center text-sm"
                  title="Remove from dashboard (emails remain in Gmail)"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove ({selectedMessages.length})
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
