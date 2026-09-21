import { useMemo, useState } from "react";
import {
  Star,
  Search,
  MessageSquare,
  CornerDownRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import "./ProviderReviews.css";

const initialReviews = [
  {
    id: 1,
    customer: "Ahmed Hassan",
    product: "Fresh Milk 1L",
    rating: 5,
    date: "Today",
    comment: "Very fresh and delivered on time. Will order again!",
    reply: "Thank you Ahmed, happy to serve you!",
  },
  {
    id: 2,
    customer: "Sara Mohamed",
    product: "Olive Oil 500ml",
    rating: 4,
    date: "Yesterday",
    comment: "Great quality, packaging could be better.",
    reply: "",
  },
  {
    id: 3,
    customer: "Omar Khaled",
    product: "Chicken Breast 1kg",
    rating: 2,
    date: "2 days ago",
    comment: "The order arrived a bit late and the meat wasn't cold enough.",
    reply: "",
  },
  {
    id: 4,
    customer: "Mona Ali",
    product: "Arabic Bread Pack",
    rating: 5,
    date: "3 days ago",
    comment: "Soft and fresh every time.",
    reply: "We appreciate it, Mona!",
  },
  {
    id: 5,
    customer: "Youssef Adel",
    product: "White Cheese 500g",
    rating: 3,
    date: "4 days ago",
    comment: "Taste is good but a little too salty for me.",
    reply: "",
  },
  {
    id: 6,
    customer: "Laila Samir",
    product: "Basmati Rice 2kg",
    rating: 5,
    date: "5 days ago",
    comment: "",
    reply: "",
  },
];

const ratingFilters = ["all", 5, 4, 3, 2, 1];
const replyFilters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Needs reply" },
  { key: "replied", label: "Replied" },
];

function Stars({ value, size = 16 }) {
  return (
    <span className="rv-stars" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? "on" : ""}
        />
      ))}
    </span>
  );
}

export default function ProviderReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [replyFilter, setReplyFilter] = useState("all");
  const [query, setQuery] = useState("");

  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");

  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return { star, count, percent: total ? (count / total) * 100 : 0 };
    });
    const replied = reviews.filter((r) => r.reply).length;

    return {
      total,
      average: total ? sum / total : 0,
      distribution,
      replied,
      pending: total - replied,
    };
  }, [reviews]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      const matchRating = ratingFilter === "all" || r.rating === ratingFilter;
      const matchReply =
        replyFilter === "all" ||
        (replyFilter === "replied" ? Boolean(r.reply) : !r.reply);
      const matchQuery =
        !q ||
        r.customer.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q);
      return matchRating && matchReply && matchQuery;
    });
  }, [reviews, ratingFilter, replyFilter, query]);

  const startReply = (review) => {
    setReplyingId(review.id);
    setReplyText(review.reply);
    setReplyError("");
  };

  const cancelReply = () => {
    setReplyingId(null);
    setReplyText("");
    setReplyError("");
  };

  const saveReply = (id) => {
    const text = replyText.trim();
    if (!text) return setReplyError("Write a reply first");
    if (text.length > 300)
      return setReplyError("Reply is too long (max 300 characters)");

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: text } : r)),
    );
    cancelReply();
  };

  const deleteReply = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: "" } : r)),
    );
  };

  return (
    <div className="provider-reviews">
      <div className="rv-header">
        <h1>Reviews</h1>
        <p>See what customers say and reply to their feedback.</p>
      </div>

      <section className="rv-overview">
        <div className="rv-panel rv-score">
          <strong className="rv-score-value">{stats.average.toFixed(1)}</strong>
          <Stars value={stats.average} size={20} />
          <span>Based on {stats.total} reviews</span>
        </div>

        <div className="rv-panel rv-distribution">
          <h3>Rating breakdown</h3>

          <ul>
            {stats.distribution.map((d) => (
              <li key={d.star}>
                <span className="rv-dist-label">
                  {d.star} <Star size={13} />
                </span>
                <div className="rv-progress">
                  <div
                    className="rv-progress-fill"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
                <span className="rv-dist-count">{d.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rv-mini-cards">
          <div className="rv-panel rv-mini">
            <div className="rv-mini-icon tone-success">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span>Replied</span>
              <strong>{stats.replied}</strong>
            </div>
          </div>

          <div className="rv-panel rv-mini">
            <div className="rv-mini-icon tone-warning">
              <Clock size={20} />
            </div>
            <div>
              <span>Needs reply</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="rv-panel rv-toolbar">
        <div className="rv-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer or product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="rv-chips">
          {ratingFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={`rv-chip ${ratingFilter === f ? "active" : ""}`}
              onClick={() => setRatingFilter(f)}
            >
              {f === "all" ? (
                "All ratings"
              ) : (
                <>
                  {f} <Star size={12} />
                </>
              )}
            </button>
          ))}
        </div>

        <div className="rv-chips">
          {replyFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`rv-chip ${replyFilter === f.key ? "active" : ""}`}
              onClick={() => setReplyFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rv-list">
        {filtered.length === 0 ? (
          <div className="rv-panel rv-empty">
            <MessageSquare size={28} />
            <p>No reviews match your filters.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <article key={r.id} className="rv-panel rv-review">
              <div className="rv-review-top">
                <div className="rv-avatar">{r.customer.charAt(0)}</div>

                <div className="rv-review-info">
                  <strong>{r.customer}</strong>
                  <span>
                    on {r.product} · {r.date}
                  </span>
                </div>

                <Stars value={r.rating} />
              </div>

              <p className={`rv-comment ${r.comment ? "" : "empty"}`}>
                {r.comment || "The customer left a rating without a comment."}
              </p>

              {r.reply && replyingId !== r.id && (
                <div className="rv-reply">
                  <CornerDownRight size={16} />
                  <div>
                    <strong>Your reply</strong>
                    <p>{r.reply}</p>
                  </div>
                </div>
              )}

              {replyingId === r.id ? (
                <div className="rv-reply-form">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      setReplyError("");
                    }}
                    className={replyError ? "invalid" : ""}
                    placeholder="Write a polite reply..."
                    autoFocus
                  />

                  <div className="rv-reply-meta">
                    {replyError ? (
                      <small className="rv-error">{replyError}</small>
                    ) : (
                      <span />
                    )}
                    <small>{replyText.length}/300</small>
                  </div>

                  <div className="rv-actions">
                    <button
                      type="button"
                      className="rv-btn-secondary"
                      onClick={cancelReply}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rv-btn-primary"
                      onClick={() => saveReply(r.id)}
                    >
                      {r.reply ? "Update reply" : "Send reply"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rv-actions start">
                  <button
                    type="button"
                    className="rv-btn-ghost"
                    onClick={() => startReply(r)}
                  >
                    {r.reply ? "Edit reply" : "Reply"}
                  </button>

                  {r.reply && (
                    <button
                      type="button"
                      className="rv-btn-link danger"
                      onClick={() => deleteReply(r.id)}
                    >
                      Delete reply
                    </button>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
