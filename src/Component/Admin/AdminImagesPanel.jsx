import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import imagesAPI from '../../services/imagesAPI';

const CATEGORIES = [
  { value: 'business', label: 'Business' },
  { value: 'people', label: 'People' },
  { value: 'nature', label: 'Nature' },
  { value: 'food', label: 'Food' },
  { value: 'technology', label: 'Technology' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'travel', label: 'Travel' },
  { value: 'abstract', label: 'Abstract' },
];

const emptyForm = {
  title: '',
  description: '',
  image_category: 'business',
  license_type: 'royalty_free',
  standard_price: '9.99',
  currency: 'GBP',
  promotion_tier: 'standard',
  tags: '',
};

const AdminImagesPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await imagesAPI.adminListImages({
        search: search || undefined,
        verification_status: status !== 'all' ? status : undefined,
        per_page: 40,
      });
      const rows = res?.data?.data || res?.data || [];
      setItems(Array.isArray(rows) ? rows : []);
    } catch (e) {
      toast.error(e?.message || e?.response?.data?.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Choose an image file first');
      return;
    }
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const uploadRes = await imagesAPI.uploadImage(fd);
      const upload = uploadRes?.data || uploadRes;
      const path = upload?.path;
      if (!path) throw new Error('Upload failed — no path returned');

      const authUser = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        short_description: form.description.trim().slice(0, 140),
        main_image: path,
        images: [path],
        thumbnail: path,
        width: upload.width || null,
        height: upload.height || null,
        orientation: upload.orientation || 'landscape',
        color_type: 'color',
        image_category: form.image_category,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        license_type: form.license_type,
        standard_price: Number(form.standard_price) || 0,
        extended_price: 29.99,
        exclusive_price: 199.99,
        currency: form.currency,
        promotion_tier: form.promotion_tier,
        contact_name:
          [authUser.first_name, authUser.last_name].filter(Boolean).join(' ') ||
          authUser.name ||
          'WWA Admin',
        contact_email: authUser.email || 'admin@worldwideadverts.info',
        agreed_to_terms: true,
        media_type: 'image',
      };

      await imagesAPI.createImage(payload);
      toast.success('Image uploaded to Images & Media');
      setForm(emptyForm);
      setFile(null);
      load();
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const verify = async (id) => {
    try {
      await imagesAPI.verifyImage(id);
      toast.success('Verified');
      load();
    } catch (e) {
      toast.error(e?.message || 'Verify failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this image listing?')) return;
    try {
      await imagesAPI.deleteImage(id);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  const imageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const api = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';
    const origin = api.replace(/\/api\/v1\/?$/, '');
    return `${origin}/storage/${path.replace(/^\//, '')}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-1">Upload to Images &amp; Media</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Super admins can upload stock photos here. They publish immediately on the public Images &amp; Media category.
        </p>

        <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Image file</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
            ) : (
              <div className="w-full h-48 rounded-lg border border-dashed flex items-center justify-center text-sm text-muted-foreground">
                Preview
              </div>
            )}
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="e.g. Industrial yard stock photo"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => onChange('description', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm min-h-[90px]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.image_category}
                onChange={(e) => onChange('image_category', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ({form.currency})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.standard_price}
                onChange={(e) => onChange('standard_price', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => onChange('tags', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="industrial, warehouse, property"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 rounded-md bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Upload & publish'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold">Library</h2>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="rounded-md border px-3 py-2 text-sm"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                <img
                  src={imageUrl(item.main_image || item.thumbnail)}
                  alt={item.title}
                  className="w-full h-40 object-cover bg-gray-100"
                />
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold line-clamp-2">{item.title}</h3>
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-100">
                      {item.verification_status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.image_category}</p>
                  <div className="flex gap-2">
                    {item.verification_status !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => verify(item.id)}
                        className="text-xs px-2 py-1 rounded bg-green-600 text-white"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-xs px-2 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImagesPanel;
