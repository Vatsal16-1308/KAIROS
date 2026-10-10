import "./Events.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar/Navbar";
import SearchBar from "../../components/event/SearchBar/SearchBar";
import FilterSidebar from "../../components/event/FilterSidebar/FilterSidebar";
import SortDropdown from "../../components/event/SortDropdown/SortDropdown";
import EventCard from "../../components/event/EventCard/EventCard";
import eventService from "../../services/eventService";
import staticEvents from "../../data/events";

function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("latest");
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state if URL query params change
  useEffect(() => {
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
    if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await eventService.getAllEvents({
          category: selectedCategory,
          search: searchTerm,
          sortBy: sortBy,
        });
        if (isMounted) {
          if (res.success && Array.isArray(res.data)) {
            setEventsList(res.data);
          } else {
            setEventsList([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          // Fallback to client-side filtering if backend is temporarily starting up
          const fallback = [...staticEvents]
            .filter((event) => {
              const matchesSearch = event.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
              const matchesCategory =
                selectedCategory === "All"
                  ? true
                  : event.category.toLowerCase() === selectedCategory.toLowerCase();
              return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
              switch (sortBy) {
                case "low":
                  return parseInt(a.price.replace(/\D/g, "") || 0) -
                         parseInt(b.price.replace(/\D/g, "") || 0);
                case "high":
                  return parseInt(b.price.replace(/\D/g, "") || 0) -
                         parseInt(a.price.replace(/\D/g, "") || 0);
                case "oldest":
                  return new Date(a.date) - new Date(b.date);
                case "latest":
                default:
                  return new Date(b.date) - new Date(a.date);
              }
            });
          setEventsList(fallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEvents();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <Navbar />

      <section className="events-page">
        <div className="events-header">
          <h1>Explore Events</h1>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              if (term) {
                setSearchParams({ search: term, ...(selectedCategory !== "All" ? { category: selectedCategory } : {}) });
              } else {
                setSearchParams(selectedCategory !== "All" ? { category: selectedCategory } : {});
              }
            }}
          />
        </div>

        <div className="events-content">
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat !== "All") {
                setSearchParams({ category: cat, ...(searchTerm ? { search: searchTerm } : {}) });
              } else {
                setSearchParams(searchTerm ? { search: searchTerm } : {});
              }
            }}
          />

          <div className="events-main">
            <div className="events-top-bar">
              <span className="events-count">
                Showing <strong>{eventsList.length}</strong> events
              </span>
              <SortDropdown
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>

            {loading ? (
              <div className="events-loading">
                <div className="loading-spinner"></div>
                <p>Loading campus events...</p>
              </div>
            ) : error ? (
              <div className="events-error">
                <p>{error}</p>
              </div>
            ) : (
              <div className="events-grid">
                {eventsList.length > 0 ? (
                  eventsList.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))
                ) : (
                  <div className="no-events">
                    <h2>No Events Found</h2>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Events;