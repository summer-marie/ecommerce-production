import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAbout, updateAbout } from "../redux/aboutSlice";
import { compressImage, convertImageToBase64 } from "../utils/imageUtils";

// Text formatting helpers

function titleCase(text = "") {
  // Preserve spaces; capitalize first letter of every word, lowercase the rest
  return text.replace(/\b([A-Za-z])([A-Za-z]*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());
}

function capitalizeSentenceStarts(text = "") {
  // Capitalize first letter after start or after . ! ? followed by space(s)
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
}

const Field = ({ label, value, onChange, textarea, format }) => (
  <label className="block mb-4">
    <span className="block text-sm font-medium text-gray-200 mb-1">
      {label}
    </span>
    {textarea ? (
      <textarea
        className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
        rows={4}
        value={value}
        onChange={(e) =>
          onChange(
            format === "description"
              ? capitalizeSentenceStarts(e.target.value)
              : e.target.value
          )
        }
      />
    ) : (
      <input
        className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
        value={value}
        onChange={(e) =>
          onChange(
            format === "heading"
              ? titleCase(e.target.value)
              : e.target.value
          )
        }
      />
    )}
  </label>
);

const ImageInput = ({ label, image, onChange }) => {
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(image?.data || "");

  const onFile = async (file) => {
    try {
      setError("");
      if (!file) return;
      const compressed = await compressImage(file, 0.85, 1200);
      const b64 = await convertImageToBase64(compressed);
      setPreview(b64.data);
      onChange(b64);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="mb-4">
      <span className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </span>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-600"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {error && <div className="text-red-400 text-sm mt-1">{error}</div>}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-2 rounded border border-gray-700 max-h-48 object-cover"
        />
      )}
    </div>
  );
};

export default function AdminAboutSettings() {
  const dispatch = useDispatch();
  const { data, status, updating, error } = useSelector((s) => s.about);
  const [form, setForm] = useState({
    topHeading: "",
    topDescription: "",
    centerHeading: "",
    centerDescription: "",
    bottomHeading: "",
    bottomDescription: "",
    topImage: null,
    centerImage: null,
    bottomImage: null,
  });

  useEffect(() => {
    if (status === "idle") dispatch(fetchAbout());
  }, [status, dispatch]);

  useEffect(() => {
    if (data) {
      setForm((f) => ({
        ...f,
        topHeading: data.topHeading || "",
        topDescription: data.topDescription || "",
        centerHeading: data.centerHeading || "",
        centerDescription: data.centerDescription || "",
        bottomHeading: data.bottomHeading || "",
        bottomDescription: data.bottomDescription || "",
        topImage: data.topImage || data.gardenImage || null,
        centerImage: data.centerImage || data.doughImage || null,
        bottomImage: data.bottomImage || data.herbsImage || null,
      }));
    }
  }, [data]);

  const handleSave = async () => {
    const payload = { ...form };
    // Only send images if present; keep shape consistent
    ["topImage", "centerImage", "bottomImage"].forEach((k) => {
      if (payload[k] && !payload[k].data) delete payload[k];
    });
    // Normalize headings/descriptions per rules
    const normalized = {
      ...payload,
  topHeading: titleCase(payload.topHeading || ""),
  centerHeading: titleCase(payload.centerHeading || ""),
  bottomHeading: titleCase(payload.bottomHeading || ""),
      topDescription: capitalizeSentenceStarts(payload.topDescription || ""),
      centerDescription: capitalizeSentenceStarts(payload.centerDescription || ""),
      bottomDescription: capitalizeSentenceStarts(payload.bottomDescription || ""),
    };
    try {
      await dispatch(updateAbout(normalized)).unwrap();
      // Optionally show a success message or toast here
  dispatch(fetchAbout());
    } catch (e) {
      // Swallow to avoid "Uncaught (in promise)"; error is shown via slice state
      console.error("Update about failed:", e);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-stone-600 mb-4">
        About Page Settings
      </h1>

      <p className="text-md text-red-600 mb-4">
        Note: Any fields left blank will render as empty space on the website.
        For a complete look, provide both a heading, description, and image for
        each section.
      </p>

      {error && <div className="mb-3 text-red-400">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 bg-emerald-950/60 border border-emerald-800 rounded-xl p-4 shadow-xl">

          <div className="mt-2">
            <Field
              label="Top Heading"
              value={form.topHeading}
              onChange={(v) => setForm({ ...form, topHeading: v })}
              format="heading"
            />
            <Field
              label="Top Description"
              value={form.topDescription}
              onChange={(v) => setForm({ ...form, topDescription: v })}
              textarea
              format="description"
            />
          </div>

          <div className="mt-2">
            <Field
              label="Center Heading"
              value={form.centerHeading}
              onChange={(v) => setForm({ ...form, centerHeading: v })}
              format="heading"
            />
            <Field
              label="Center Description"
              value={form.centerDescription}
              onChange={(v) => setForm({ ...form, centerDescription: v })}
              textarea
              format="description"
            />
          </div>

          <div className="mt-2">
            <Field
              label="Bottom Heading"
              value={form.bottomHeading}
              onChange={(v) => setForm({ ...form, bottomHeading: v })}
              format="heading"
            />
            <Field
              label="Bottom Description"
              value={form.bottomDescription}
              onChange={(v) => setForm({ ...form, bottomDescription: v })}
              textarea
              format="description"
            />
          </div>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-800 rounded-xl p-4 shadow-xl">
          <ImageInput
            label="Top Image"
            image={form.topImage}
            onChange={(img) => setForm({ ...form, topImage: img })}
          />
          <ImageInput
            label="Center Image"
            image={form.centerImage}
            onChange={(img) => setForm({ ...form, centerImage: img })}
          />
          <ImageInput
            label="Bottom Image"
            image={form.bottomImage}
            onChange={(img) => setForm({ ...form, bottomImage: img })}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          disabled={updating}
          className="px-4 py-2 rounded bg-lime-400 text-gray-900 font-semibold hover:bg-lime-300 disabled:opacity-60"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => dispatch(fetchAbout())}
          className="px-4 py-2 rounded border border-gray-600 text-stone-700 hover:bg-gray-800 hover:text-stone-100"
        >
          Refresh
        </button>
      </div>

      {data && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-stone-600 mb-3">
            Live Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["topImage", "centerImage", "bottomImage"].map((k) => (
              <div
                key={k}
                className="rounded-lg border border-gray-700 p-2 bg-gray-900/40"
              >
                <div className="text-sm text-gray-300 mb-1">{k}</div>
                {form[k]?.data ? (
                  <img
                    src={form[k].data}
                    alt={k}
                    className="rounded object-cover max-h-48 w-full"
                  />
                ) : (
                  <div className="text-gray-500 text-sm">No image</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
