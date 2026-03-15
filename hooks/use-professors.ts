"use client";

import { useEffect, useState } from "react";
import {
  fetchProfessorsAction,
  fetchReviewsAction,
  type Professor,
  type Review,
} from "@/app/(app)/professors/actions";

export type { Professor, Review };

export function useProfessors() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchProfessorsAction(), fetchReviewsAction()])
      .then(([profs, revs]) => {
        if (cancelled) return;
        setProfessors(profs);
        setReviews(revs);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { professors, reviews, setReviews, loading };
}
