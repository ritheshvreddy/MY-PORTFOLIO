import {
  useEffect,
  useState,
} from "react";

import {
  getRecentMessages,
} from "../../../services/contact.service";

import type {
  ContactMessage,
} from "../../../types/contact";


export default function RecentMessages() {

  const [
    messages,
    setMessages,
  ] = useState<ContactMessage[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    async function loadMessages() {

      try {

        setLoading(true);

        const data =
          await getRecentMessages();

        setMessages(data);

      } catch (error) {

        console.error(
          "Error loading recent messages:",
          error
        );

        setMessages([]);

      } finally {

        setLoading(false);

      }

    }

    loadMessages();

  }, []);


  return (

    <div
      style={{
        background: "white",
        padding: 24,
        borderRadius: 18,
        marginTop: 40,
        boxShadow:
          "0 10px 30px rgba(0,0,0,.06)",
      }}
    >

      <h2>
        Recent Messages
      </h2>


      {loading && (

        <p>
          Loading messages...
        </p>

      )}


      {!loading &&
        messages.length === 0 && (

          <p>
            No messages yet.
          </p>

        )}


      {!loading &&
        messages.map(
          (message) => (

            <div
              key={message.id}
              style={{
                padding: "18px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >

              <strong>
                {message.full_name}
              </strong>


              <div>
                {message.email}
              </div>


              {message.subject && (

                <div>
                  {message.subject}
                </div>

              )}

            </div>

          )
        )}

    </div>

  );

}