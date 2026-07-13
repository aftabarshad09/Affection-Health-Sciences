import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const emptyPost = {
  slug: '',
  title: '',
  metaDescription: '',
  date: new Date().toISOString().slice(0, 10),
  readTime: '5 min read',
  category: '',
  categoryColor: '#10b981',
  featured: false,
  featuredImage: '',
  author: 'Affection Health Sciences Team',
  sections: [],
};

const blankSection = (type) => {
  switch (type) {
    case 'heading': return { type, level: 2, content: '' };
    case 'paragraph': return { type, content: '' };
    case 'image': return { type, src: '', alt: '', index: 1 };
    case 'list': return { type, ordered: false, items: [''] };
    case 'table': return { type, headers: [''], rows: [['']] };
    case 'faq': return { type, items: [{ question: '', answer: '' }] };
    default: return { type, content: '' };
  }
};

function SectionEditor({ section, onChange, onRemove, onMove, authFetch }) {
  const update = (patch) => onChange({ ...section, ...patch });

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await authFetch('/api/blogs/upload-image', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) update({ src: data.url });
  };

  return (
    <div className="admin-section-block">
      <div className="admin-section-block__head">
        <strong>{section.type}</strong>
        <div className="admin-row-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => onMove(-1)}>↑</button>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => onMove(1)}>↓</button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={onRemove}>Remove</button>
        </div>
      </div>

      {section.type === 'heading' && (
        <>
          <select value={section.level} onChange={(e) => update({ level: Number(e.target.value) })}>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input value={section.content} onChange={(e) => update({ content: e.target.value })} placeholder="Heading text" />
        </>
      )}

      {section.type === 'paragraph' && (
        <textarea rows={3} value={section.content} onChange={(e) => update({ content: e.target.value })} placeholder="Paragraph (HTML allowed, e.g. <strong>)" />
      )}

      {section.type === 'image' && (
        <>
          <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])} />
          {section.src && <img src={section.src} alt="" style={{ maxWidth: 120, display: 'block', margin: '0.5rem 0' }} />}
          <input value={section.alt} onChange={(e) => update({ alt: e.target.value })} placeholder="Alt text" />
        </>
      )}

      {section.type === 'list' && (
        <>
          <label>
            <input type="checkbox" checked={section.ordered} onChange={(e) => update({ ordered: e.target.checked })} /> Ordered list
          </label>
          {section.items.map((item, i) => (
            <div className="admin-list-field" key={i}>
              <input
                value={item}
                onChange={(e) => update({ items: section.items.map((v, j) => (j === i ? e.target.value : v)) })}
              />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ items: section.items.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ items: [...section.items, ''] })}>+ Add item</button>
        </>
      )}

      {section.type === 'table' && (
        <>
          <label>Headers</label>
          <div className="admin-list-field">
            {section.headers.map((h, i) => (
              <input
                key={i}
                value={h}
                onChange={(e) => update({ headers: section.headers.map((v, j) => (j === i ? e.target.value : v)) })}
              />
            ))}
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ headers: [...section.headers, ''], rows: section.rows.map((r) => [...r, '']) })}>+ Column</button>
          </div>
          <label>Rows</label>
          {section.rows.map((row, ri) => (
            <div className="admin-list-field" key={ri}>
              {row.map((cell, ci) => (
                <input
                  key={ci}
                  value={cell}
                  onChange={(e) => update({
                    rows: section.rows.map((r, rj) => (rj === ri ? r.map((c, cj) => (cj === ci ? e.target.value : c)) : r)),
                  })}
                />
              ))}
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ rows: section.rows.filter((_, rj) => rj !== ri) })}>Remove row</button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ rows: [...section.rows, section.headers.map(() => '')] })}>+ Row</button>
        </>
      )}

      {section.type === 'faq' && (
        <>
          {section.items.map((item, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <input
                value={item.question}
                placeholder="Question"
                onChange={(e) => update({ items: section.items.map((v, j) => (j === i ? { ...v, question: e.target.value } : v)) })}
              />
              <textarea
                rows={2}
                value={item.answer}
                placeholder="Answer"
                onChange={(e) => update({ items: section.items.map((v, j) => (j === i ? { ...v, answer: e.target.value } : v)) })}
              />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ items: section.items.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => update({ items: [...section.items, { question: '', answer: '' }] })}>+ Add FAQ</button>
        </>
      )}
    </div>
  );
}

export default function BlogForm() {
  const { slug: slugParam } = useParams();
  const isEdit = Boolean(slugParam);
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(emptyPost);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/blogs/${slugParam}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setPost(data.post); });
  }, [slugParam, isEdit]);

  const setField = (field, value) => setPost((p) => ({ ...p, [field]: value }));

  const updateSection = (index, updated) =>
    setPost((p) => ({ ...p, sections: p.sections.map((s, i) => (i === index ? updated : s)) }));

  const removeSection = (index) =>
    setPost((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }));

  const moveSection = (index, dir) =>
    setPost((p) => {
      const next = [...p.sections];
      const target = index + dir;
      if (target < 0 || target >= next.length) return p;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...p, sections: next };
    });

  const addSection = (type) =>
    setPost((p) => ({ ...p, sections: [...p.sections, blankSection(type)] }));

  const uploadFeaturedImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await authFetch('/api/blogs/upload-image', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) setField('featuredImage', data.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (featuredImageFile) await uploadFeaturedImage(featuredImageFile);

    try {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      const url = isEdit ? `/api/blogs/${slugParam}` : '/api/blogs';
      const res = await authFetch(url, { method: isEdit ? 'PUT' : 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      navigate('/admin/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Post' : 'New Post'}</h1>
      <form className="admin-card" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label>Slug (URL path, e.g. "my-post-title")</label>
          <input value={post.slug} onChange={(e) => setField('slug', e.target.value)} disabled={isEdit} required />
        </div>
        <div className="admin-field">
          <label>Title</label>
          <input value={post.title} onChange={(e) => setField('title', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Meta description (for SEO and article previews)</label>
          <textarea rows={2} value={post.metaDescription} onChange={(e) => setField('metaDescription', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Date</label>
          <input type="date" value={post.date} onChange={(e) => setField('date', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Read time</label>
          <input value={post.readTime} onChange={(e) => setField('readTime', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Category</label>
          <input value={post.category} onChange={(e) => setField('category', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Category color</label>
          <input type="color" value={post.categoryColor} onChange={(e) => setField('categoryColor', e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Author</label>
          <input value={post.author} onChange={(e) => setField('author', e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>
            <input type="checkbox" checked={post.featured} onChange={(e) => setField('featured', e.target.checked)} style={{ marginRight: '0.5rem' }} />
            Featured (shown at top of blog listing)
          </label>
        </div>
        <div className="admin-field">
          <label>Featured image {post.featuredImage && <span>(current: {post.featuredImage})</span>}</label>
          <input type="file" accept="image/*" onChange={(e) => setFeaturedImageFile(e.target.files[0])} />
        </div>

        <h3>Content sections</h3>
        {post.sections.map((section, i) => (
          <SectionEditor
            key={i}
            section={section}
            authFetch={authFetch}
            onChange={(updated) => updateSection(i, updated)}
            onRemove={() => removeSection(i)}
            onMove={(dir) => moveSection(i, dir)}
          />
        ))}

        <div className="admin-row-actions" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['heading', 'paragraph', 'image', 'list', 'table', 'faq'].map((type) => (
            <button key={type} type="button" className="admin-btn admin-btn--ghost" onClick={() => addSection(type)}>
              + {type}
            </button>
          ))}
        </div>

        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Post'}
        </button>
      </form>
    </div>
  );
}
