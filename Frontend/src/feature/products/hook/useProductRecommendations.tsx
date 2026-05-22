import { useState, useEffect } from "react";
import { productService } from "@/src/services/productService";
import { ProductListResponse } from "../type/products";



export const useProductRecommendations = () => {
const [recommendations, setRecommendations] = useState<ProductListResponse | null>(null);
  const [loadingRec, setLoadingRec] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await productService.getRecommendations();
        setRecommendations( res || []);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoadingRec(false);
      }
    };

    fetchRecs();
  }, []);

  return { recommendations, loadingRec };
};