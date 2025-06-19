"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col items-center justify-center mt-8">
      <div className="w-full max-w-xl">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          users.map((user, idx) => (
            <div
              key={user.id || idx}
              className="flex items-center justify-between bg-gray-100 rounded-lg px-6 py-3 mb-2"
            >
              <span className="w-1/3">
                {user.name ? (
                  user.name
                ) : (
                  <span className="italic text-gray-500">No name</span>
                )}
              </span>
              <span className="w-1/3 text-gray-700">{user.email}</span>
              <Link
                href={`/users/${user.id}/edit`}
                className="border border-gray-400 rounded-lg px-4 py-1 hover:bg-gray-200 transition-all text-center"
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
} 