"use client";
import { useState, useEffect } from "react";
import Right from "../components/icons/Right";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Load item for editing if editId is present
  useEffect(() => {
    if (editId) {
      setLoading(true);
      fetch(`/api/products`)
        .then(res => res.json())
        .then(items => {
          const item = items.find(i => i.id === Number(editId));
          if (item) {
            setPreview(item.image || null);
            setItemName(item.name || "");
            setDescription(item.description || "");
            setBasePrice(item.price?.toString() || "");
            setCategoryId(item.categoryId?.toString() || "");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setImage(null);
      setPreview(null);
      setItemName("");
      setDescription("");
      setBasePrice("");
      setCategoryId("");
    }
  }, [editId]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleEditClick() {
    document.getElementById("item-image-upload").click();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: itemName,
      description,
      price: basePrice,
      image: preview,
      categoryId: Number(categoryId),
    };
    if (editId) {
      // Update existing item
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editId }),
      });
    } else {
      // Add new item
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setLoading(false);
    router.push("/products/all");
  }

  async function handleDelete() {
    if (!editId) return;
    setLoading(true);
    await fetch(`/api/products?id=${editId}`, { method: "DELETE" });
    setLoading(false);
    router.push("/products/all");
  }

  return (
    <section className="flex flex-col items-center justify-center mt-8">
      {/* Show all menu items button */}
      <div className="w-full flex justify-center mb-6">
        <a href="/products/all" className="flex items-center gap-2 border rounded-xl px-8 py-3 font-semibold text-gray-700 bg-white hover:bg-gray-100 transition-all text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Show all menu items</span>
        </a>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-4 rounded-lg">
        {/* Image and Edit */}
        <div className="flex flex-col items-center">
          <div className="w-[180px] h-[180px] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden mb-2">
            {preview ? (
              <img src={preview} alt="Preview" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="item-image-upload"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="border border-orange-400 text-orange-500 rounded-xl px-8 py-2 font-semibold hover:bg-orange-50 transition-all"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
        {/* Form */}
        <form className="flex flex-col gap-0 min-w-[260px]" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-gray-700 mb-[2px]" htmlFor="itemName">Item name</label>
          <input
            id="itemName"
            type="text"
            className="p-1 border rounded-md bg-gray-100 mt-0"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700 mb-[2px]" htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            className="p-1 border rounded-md bg-gray-100 mt-0"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700 mb-[2px]" htmlFor="basePrice">Base price</label>
          <input
            id="basePrice"
            type="text"
            className="p-1 border rounded-md bg-gray-100 mt-0"
            value={basePrice}
            onChange={e => setBasePrice(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700 mb-[2px]" htmlFor="category">Kategori</label>
          <select
            id="category"
            className="p-1 border rounded-md bg-gray-100 mt-0 mb-2"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Bir kategori seçin</option>
            {categories.filter(cat => cat.name !== 'Yiyicek').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-orange-500 text-white rounded-xl py-2 font-semibold mt-2 hover:bg-orange-600 transition-all"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          {editId && (
            <button
              type="button"
              className="flex items-center gap-2 border border-gray-400 text-gray-700 rounded-xl px-4 py-2 font-semibold mt-4 hover:bg-gray-100 transition-all"
              onClick={handleDelete}
              disabled={loading}
            >
              <span>🗑️</span>
              Delete this menu item
            </button>
          )}
        </form>
      </div>
    </section>
  );
} 