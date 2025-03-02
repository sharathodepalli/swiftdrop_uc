// src/services/reviewService.js
import { db } from '../services/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Add a Review
export const addReview = async (userId, reviewerId, rating, comment) => {
  const reviewRef = doc(collection(db, 'reviews'));
  await setDoc(reviewRef, {
    userId,         // The person being reviewed
    reviewerId,     // The person giving the review
    rating,         // Star rating (1 to 5)
    comment,        // Review text
    createdAt: serverTimestamp(),
  });
};

// Get User Reviews
export const getUserReviews = async (userId) => {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(reviewsQuery);
  
  const reviews = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Calculate average rating
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? (total / reviews.length).toFixed(1) : "No ratings yet";
  
  return {
    reviews,
    averageRating
  };
};
