import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import { blogArticles } from "../data/seed";
import { blogImages } from "../data/blogImages";
import "../style/BlogPost.css";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Groups each "image" section with the paragraphs that immediately follow it,
// so the image can be laid out side-by-side with its related text.
const groupSections = (sections) => {
  const groups = [];
  let i = 0;
  while (i < sections.length) {
    const section = sections[i];
    if (section.type === "image") {
      const paragraphs = [];
      let j = i + 1;
      while (j < sections.length && sections[j].type === "paragraph") {
        paragraphs.push(sections[j]);
        j++;
      }
      groups.push({ type: "media", image: section, paragraphs });
      i = j;
    } else {
      groups.push(section);
      i++;
    }
  }
  return groups;
};

const renderParagraph = (section, key) => (
  <p
    key={key}
    className="blog-post__paragraph"
    dangerouslySetInnerHTML={{ __html: section.content }}
  />
);

const renderMedia = ({ image, paragraphs }, index, gallery) => {
  const src = gallery?.[(image.index || 1) - 1] ?? gallery?.[0];

  if (paragraphs.length === 0) {
    return (
      <div key={`media-${index}`} className="blog-post__solo-image-wrap">
        <img src={src} alt={image.alt} className="blog-post__solo-image" />
      </div>
    );
  }

  return (
    <div key={`media-${index}`} className="blog-post__media-row">
      <div className="blog-post__media-image-wrap">
        <img src={src} alt={image.alt} className="blog-post__media-image" />
      </div>
      <div className="blog-post__media-text">
        {paragraphs.map((p, i) => renderParagraph(p, `media-${index}-p-${i}`))}
      </div>
    </div>
  );
};

const renderSection = (section, index) => {
  switch (section.type) {
    case "heading": {
      const Tag = `h${section.level || 2}`;
      return <Tag key={index} className="blog-post__heading">{section.content}</Tag>;
    }
    case "paragraph":
      return renderParagraph(section, index);
    case "list": {
      const ListTag = section.ordered ? "ol" : "ul";
      return (
        <ListTag key={index} className="blog-post__list">
          {section.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ListTag>
      );
    }
    case "table":
      return (
        <div key={index} className="blog-post__table-wrap">
          <table className="blog-post__table">
            <thead>
              <tr>
                {section.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div key={index} className="blog-post__faq">
          {section.items.map((item, i) => (
            <div key={i} className="blog-post__faq-item">
              <p className="blog-post__faq-question">{item.question}</p>
              <p className="blog-post__faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default function BlogPost() {
  const { slug } = useParams();
  const article = blogArticles.find((a) => a.slug === slug);
  const [readProgress, setReadProgress] = useState(0);

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

  if (!article) {
    return (
      <div className="blog-post blog-post--missing">
        <div className="container">
          <h1>Article not found</h1>
          <p>The article you're looking for doesn't exist or may have been moved.</p>
          <Link to="/blogs" className="blog-post__back">← Back to Articles</Link>
        </div>
      </div>
    );
  }

  const images = blogImages[article.slug];
  const heroImage = images?.hero;
  const gallery = images?.gallery;
  const groupedSections = groupSections(article.sections);

  return (
    <article className="blog-post">
      <div className="blog-post__progress">
        <div className="blog-post__progress-bar" style={{ width: `${readProgress}%` }} />
        <span className="blog-post__progress-icon" style={{ left: `${readProgress}%` }}>
          <FiBookOpen size={12} />
        </span>
      </div>

      <div className="blog-post__hero">
        <img src={heroImage} alt={article.title} className="blog-post__hero-img" />
      </div>

      <div className="container blog-post__container">
        <Link to="/blogs" className="blog-post__back">← Back to Articles</Link>

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

        <div className="blog-post__body">
          {groupedSections.map((group, i) =>
            group.type === "media"
              ? renderMedia(group, i, gallery)
              : renderSection(group, i)
          )}
        </div>
      </div>
    </article>
  );
}
