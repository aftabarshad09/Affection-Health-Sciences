import { useParams, Link } from "react-router-dom";
import { blogArticles } from "../data/seed";
import { blogImages } from "../data/blogImages";
import "../style/BlogPost.css";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const renderSection = (section, index, fallbackImage) => {
  switch (section.type) {
    case "heading": {
      const Tag = `h${section.level || 2}`;
      return <Tag key={index} className="blog-post__heading">{section.content}</Tag>;
    }
    case "paragraph":
      return (
        <p
          key={index}
          className="blog-post__paragraph"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      );
    case "image":
      return (
        <img
          key={index}
          src={fallbackImage}
          alt={section.alt}
          className="blog-post__inline-image"
        />
      );
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

  const heroImage = blogImages[article.slug];

  return (
    <article className="blog-post">
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
          {article.sections.map((section, i) => renderSection(section, i, heroImage))}
        </div>
      </div>
    </article>
  );
}
