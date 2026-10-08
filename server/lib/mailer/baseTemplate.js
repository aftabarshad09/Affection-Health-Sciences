// Shared branded shell for every order-lifecycle email — keeps the header,
// footer, and base styles in one place instead of repeating them per template.
const wrapEmail = ({ title, preheader = '', bodyHtml }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #F4EFE6; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 16px rgba(27, 67, 50, 0.08); }
    .header { background: #1B4332; color: #fff; padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 1.2rem; }
    .body { padding: 24px 28px; }
    .body h2 { color: #1B4332; font-size: 1.1rem; }
    table.items { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table.items th, table.items td { text-align: left; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    .totals td { padding: 4px 0; font-size: 0.9rem; }
    .totals .grand { font-weight: 700; color: #1B4332; font-size: 1.05rem; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(45,106,79,0.12); color: #2D6A4F; font-weight: 700; font-size: 0.8rem; text-transform: capitalize; }
    .footer { text-align: center; padding: 16px; font-size: 12px; color: #9ca3af; }
    a.btn { display: inline-block; margin-top: 16px; padding: 10px 22px; background: #1B4332; color: #fff !important; border-radius: 999px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <div class="container">
    <div class="card">
      <div class="header"><h1>Affection Health Sciences</h1></div>
      <div class="body">${bodyHtml}</div>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Affection Health Sciences. B-109, B-Block, Satellite Town, Rawalpindi.</div>
  </div>
</body>
</html>
`;

module.exports = { wrapEmail };
