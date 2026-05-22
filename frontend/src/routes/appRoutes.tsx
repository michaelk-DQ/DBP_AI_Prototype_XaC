import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { RecommendationsPage } from "../pages/recommendations/RecommendationsPage";
import { SavedItemsPage } from "../pages/saved/SavedItemsPage";
import { ConciergePage } from "../pages/concierge/ConciergePage";
import { DiscoverServicesPage } from "../pages/discover/DiscoverServicesPage";
import { BrowseLearningPage } from "../pages/browse/BrowseLearningPage";
import { useIsAuthenticated } from "../store/authStore";

function HomeRedirect() {
  const isAuthenticated = useIsAuthenticated();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/concierge"} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomeRedirect />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recommendations"
          element={
            <ProtectedRoute>
              <RecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="saved"
          element={
            <ProtectedRoute>
              <SavedItemsPage />
            </ProtectedRoute>
          }
        />
        <Route path="concierge" element={<ConciergePage />} />
        <Route path="discover" element={<DiscoverServicesPage />} />
        <Route path="browse" element={<BrowseLearningPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
