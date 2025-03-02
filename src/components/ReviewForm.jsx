// src/components/ReviewForm.jsx
import { useState } from "react";
import { addReview } from "../services/reviewService";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ReviewForm({ userId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(userId, user.uid, rating, comment);
      alert("Review submitted successfully!");
      setRating(5);
      setComment("");
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      setError("Failed to submit review.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium">Rating (1-5):</label>
          <Input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1"
            required
          />
        </div>

        {/* Comment Input */}
        <div>
          <label className="block text-sm font-medium">Comment:</label>
          <Input
            type="text"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}

export default ReviewForm;
//comment