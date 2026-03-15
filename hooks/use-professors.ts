"use client";

import { useEffect, useState } from "react";
import {
  listProfessors,
  listProfessorReviews,
  type Professor,
  type Review
} from "@/queries/professors";

export function useProfessors() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [profs, revs] = await Promise.all([listProfessors(), listProfessorReviews()]);
        if (!cancelled) {
          setProfessors(profs);
          setReviews(revs);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { professors, reviews, loading };
}

