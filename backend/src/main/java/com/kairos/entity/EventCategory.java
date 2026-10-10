package com.kairos.entity;

public enum EventCategory {
    HACKATHON("Hackathon"),
    WORKSHOP("Workshop"),
    MUSIC("Music"),
    SPORTS("Sports"),
    CULTURAL_FEST("Cultural Fest"),
    SEMINAR("Seminars");

    private final String displayName;

    EventCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static EventCategory fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return null;
        }
        for (EventCategory c : EventCategory.values()) {
            if (c.name().equalsIgnoreCase(text) || c.displayName.equalsIgnoreCase(text)) {
                return c;
            }
        }
        return null;
    }
}
