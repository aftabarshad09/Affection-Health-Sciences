import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import "../style/BlogPost.css";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const cloudinaryCrop = (url, w, h) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/c_fill,g_auto,w_${w},h_${h},q_auto,f_auto/`);
};

// Images in blog data appear just before headings, so a float+clear on the
// heading kills the wrap immediately. This queues each image and injects it
// just before the first paragraph that follows, skipping over any headings.
const repositionImages = (sections) => {
  const result = [];
  let pending = null;
  for (const section of sections) {
    if (section.type === 'image') {
      pending = section;
    } else if (section.type === 'paragraph' && pending) {
      result.push(pending);
      pending = null;
      result.push(section);
    } else {
      result.push(section);
    }
  }
  if (pending) result.push(pending);
  return result;
};

const renderSections = (sections) => {
  const ordered = repositionImages(sections);
  let imgCount = 0;
  const elements = [];

  ordered.forEach((section, index) => {
    switch (section.type) {
      case "heading": {
        const Tag = `h${section.level || 2}`;
        elements.push(
          <Tag key={index} className="blog-post__heading blog-post__clear">
            {section.content}
          </Tag>
        );
        break;
      }
      case "paragraph":
        elements.push(
          <p
            key={index}
            className="blog-post__paragraph"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        );
        break;
      case "image": {
        const side = imgCount % 2 === 0 ? "left" : "right";
        imgCount++;
        elements.push(
          <div key={`img-${index}`} className={`blog-post__float-img blog-post__float-img--${side}`}>
            <img src={section.src} alt={section.alt} />
            {section.alt && <p className="blog-post__img-caption">{section.alt}</p>}
          </div>
        );
        break;
      }
      case "list": {
        const ListTag = section.ordered ? "ol" : "ul";
        elements.push(
          <ListTag key={index} className="blog-post__list">
            {section.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ListTag>
        );
        break;
      }
      case "table":
        elements.push(
          <div key={index} className="blog-post__table-wrap blog-post__clear">
            <table className="blog-post__table">
              <thead>
                <tr>
                  {section.headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => <td key={j}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
      case "faq":
        elements.push(
          <div key={index} className="blog-post__faq blog-post__clear">
            {section.items.map((item, i) => (
              <div key={i} className="blog-post__faq-item">
                <p className="blog-post__faq-question">{item.question}</p>
                <p className="blog-post__faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        );
        break;
      default:
        break;
    }
  });

  return elements;
};

export default function BlogPost() {
  const { slug } = useParams();
  const [article, setArticle] = useState(undefined);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    let active = true;
    fetch(`/api/blogs/${slug}`)
      .then((res) => res.json())
      .then((data) => { if (active) setArticle(data.success ? data.post : null); })
      .catch(() => { if (active) setArticle(null); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setReadProgress(Math.min(100, Math.max(0, percent)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  if (article === undefined) {
    return <div className="blog-post blog-post--missing" />;
  }

  if (!article) {
    return (
      <div className="blog-post blog-post--missing">
        <div className="container">
          <h1>Article not found</h1>
          <p>The article you're looking for doesn't exist or may have been moved.</p>
          <Link to="/blogs" className="blog-post__back">Back to Articles</Link>
        </div>
      </div>
    );
  }

  const heroImage = article.featuredImage;

  return (
    <article className="blog-post">
      <div className="blog-post__progress">
        <div className="blog-post__progress-bar" style={{ width: `${readProgress}%` }} />
        <span className="blog-post__progress-icon" style={{ left: `${readProgress}%` }}>
          <FiBookOpen size={12} />
        </span>
      </div>

      <div className="blog-post__hero">
        <img src={cloudinaryCrop(heroImage, 1600, 900)} alt={article.title} className="blog-post__hero-img" />
      </div>

      <div className="container blog-post__container">
        <Link to="/blogs" className="blog-post__back">Back to Articles</Link>

        <span
          className="blog-post__category"
          style={{ background: article.categoryColor }}
        >
          {article.category}
        </span>

        <h1 className="blog-post__title">{article.title}</h1>

        <div className="blog-post__meta">
          <span>{article.author}</span>
          <span className="blog-post__meta-dot">•</span>
          <span>{formatDate(article.date)}</span>
          <span className="blog-post__meta-dot">•</span>
          <span>{article.readTime}</span>
        </div>

        <div className="blog-post__body blog-post__clearfix">
          {renderSections(article.sections)}
        </div>
      </div>
    </article>
  );
}
