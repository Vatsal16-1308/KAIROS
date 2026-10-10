package com.kairos.config;

import com.kairos.entity.*;
import com.kairos.repository.BookingRepository;
import com.kairos.repository.EventRepository;
import com.kairos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding initial Kairos database records...");
            seedData();
            log.info("Database seeding completed successfully!");
        }
    }

    private void seedData() {
        // 1. Admin
        User admin = User.builder()
                .name("Kairos Administrator")
                .email("admin@kairos.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ROLE_ADMIN)
                .organizationName("Kairos HQ")
                .phone("+91 98765 43210")
                .active(true)
                .build();
        userRepository.save(admin);

        // 2. Organizers
        User ieeeOrganizer = User.builder()
                .name("IEEE Student Chapter")
                .email("ieee@kairos.com")
                .password(passwordEncoder.encode("organizer123"))
                .role(Role.ROLE_ORGANIZER)
                .organizationName("IEEE Student Branch")
                .phone("+91 98765 43211")
                .active(true)
                .build();
        userRepository.save(ieeeOrganizer);

        User csiOrganizer = User.builder()
                .name("CSI Student Chapter")
                .email("csi@kairos.com")
                .password(passwordEncoder.encode("organizer123"))
                .role(Role.ROLE_ORGANIZER)
                .organizationName("Computer Society of India")
                .phone("+91 98765 43212")
                .active(true)
                .build();
        userRepository.save(csiOrganizer);

        User musicOrganizer = User.builder()
                .name("Music Club")
                .email("music@kairos.com")
                .password(passwordEncoder.encode("organizer123"))
                .role(Role.ROLE_ORGANIZER)
                .organizationName("Harmony Music Guild")
                .phone("+91 98765 43213")
                .active(true)
                .build();
        userRepository.save(musicOrganizer);

        // 3. Attendee User
        User student = User.builder()
                .name("Alex Johnson")
                .email("student@kairos.com")
                .password(passwordEncoder.encode("student123"))
                .role(Role.ROLE_USER)
                .organizationName("Department of Computer Science")
                .phone("+91 98765 43214")
                .active(true)
                .build();
        userRepository.save(student);

        // 4. Initial Events matching frontend data
        List<ScheduleItem> standardSchedule = Arrays.asList(
                new ScheduleItem("10:00 AM", "Registration & Check-in", "Badge pickup and welcome kit distribution"),
                new ScheduleItem("11:00 AM", "Opening Ceremony", "Keynote address by distinguished guest speakers"),
                new ScheduleItem("12:30 PM", "Technical Sessions & Tracks", "Hands-on sessions, demonstrations and coding labs"),
                new ScheduleItem("02:00 PM", "Networking Lunch", "Complimentary lunch and student mixer"),
                new ScheduleItem("04:00 PM", "Award Ceremony & Closing", "Winner announcements and concluding remarks")
        );

        Event event1 = Event.builder()
                .title("AI Innovation Summit")
                .description("Explore breakthroughs in Generative AI, Large Language Models, and Machine Learning. Connect with industry experts, attend hands-on workshops, and witness state-of-the-art AI applications engineered by top students.")
                .category(EventCategory.WORKSHOP)
                .date("24 Aug 2026")
                .eventDate(LocalDateTime.of(2026, 8, 24, 10, 0))
                .location("Main Auditorium")
                .venueDetails("Auditorium Hall 1, Central Campus Building")
                .price("Free")
                .priceAmount(0.0)
                .capacity(300)
                .remainingTickets(285)
                .organizerName("IEEE Student Chapter")
                .organizer(ieeeOrganizer)
                .status(EventStatus.PUBLISHED)
                .isFeatured(true)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event1);

        Event event2 = Event.builder()
                .title("HackX 2026")
                .description("The premier 36-hour annual collegiate hackathon! Build disruptive web, mobile, AI, and Web3 solutions. Mentors from top tech giants, exciting swag, free food, and huge prize pools await.")
                .category(EventCategory.HACKATHON)
                .date("02 Sep 2026")
                .eventDate(LocalDateTime.of(2026, 9, 2, 9, 0))
                .location("Tech Block")
                .venueDetails("Lab 301-305, Advanced Computing Center")
                .price("₹199")
                .priceAmount(199.0)
                .capacity(250)
                .remainingTickets(210)
                .organizerName("CSI Student Chapter")
                .organizer(csiOrganizer)
                .status(EventStatus.PUBLISHED)
                .isFeatured(true)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event2);

        Event event3 = Event.builder()
                .title("Battle of Bands")
                .description("Campus rock & fusion music showdown! Top college bands from across the state compete live on the main outdoor stage for glory, trophies, and recording contracts.")
                .category(EventCategory.MUSIC)
                .date("15 Sep 2026")
                .eventDate(LocalDateTime.of(2026, 9, 15, 17, 30))
                .location("Open Grounds")
                .venueDetails("Open Air Theatre & Arena, East Campus")
                .price("₹99")
                .priceAmount(99.0)
                .capacity(500)
                .remainingTickets(440)
                .organizerName("Music Club")
                .organizer(musicOrganizer)
                .status(EventStatus.PUBLISHED)
                .isFeatured(true)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event3);

        Event event4 = Event.builder()
                .title("Inter-College Basketball Championship")
                .description("High-octane collegiate basketball championship featuring 16 varsity teams. Cheer for your college team across three intense days of knockout rounds.")
                .category(EventCategory.SPORTS)
                .date("20 Sep 2026")
                .eventDate(LocalDateTime.of(2026, 9, 20, 8, 30))
                .location("Sports Complex")
                .venueDetails("Indoor Basketball Arena Court A")
                .price("Free")
                .priceAmount(0.0)
                .capacity(400)
                .remainingTickets(390)
                .organizerName("Sports Council")
                .organizer(csiOrganizer)
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event4);

        Event event5 = Event.builder()
                .title("Tarang Cultural Fiesta")
                .description("The annual mega cultural festival celebrating dance, drama, art, fashion, and theatrical arts. An evening filled with color, rhythm, and unforgettable campus memories.")
                .category(EventCategory.CULTURAL_FEST)
                .date("28 Sep 2026")
                .eventDate(LocalDateTime.of(2026, 9, 28, 16, 0))
                .location("Amphitheatre")
                .venueDetails("Grand Campus Amphitheatre")
                .price("₹149")
                .priceAmount(149.0)
                .capacity(600)
                .remainingTickets(520)
                .organizerName("Cultural Committee")
                .organizer(musicOrganizer)
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event5);

        Event event6 = Event.builder()
                .title("Future of Tech Leadership Seminar")
                .description("Distinguished alumni and Silicon Valley tech leaders share their journey from campus classrooms to founding unicorn startups and leading global engineering teams.")
                .category(EventCategory.SEMINAR)
                .date("12 Oct 2026")
                .eventDate(LocalDateTime.of(2026, 10, 12, 14, 0))
                .location("Executive Center")
                .venueDetails("Auditorium B, Management Block")
                .price("Free")
                .priceAmount(0.0)
                .capacity(200)
                .remainingTickets(180)
                .organizerName("Alumni Network")
                .organizer(ieeeOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event6);

        Event event7 = Event.builder()
                .title("RoboWars 2026 Combat League")
                .description("Heavyweight combat bot battles in an enclosed steel cage arena. Flame throwers, spinners, and mechanical mayhem!")
                .category(EventCategory.WORKSHOP)
                .date("18 Oct 2026")
                .eventDate(LocalDateTime.of(2026, 10, 18, 11, 0))
                .location("Robotics Arena")
                .venueDetails("Mechanical Engineering Workshop Bay 3")
                .price("₹249")
                .priceAmount(249.0)
                .capacity(350)
                .remainingTickets(290)
                .organizerName("IEEE Student Chapter")
                .organizer(ieeeOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(true)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event7);

        Event event8 = Event.builder()
                .title("Valorant Campus E-Sports Arena")
                .description("Inter-collegiate 5v5 FPS tournament streamed live on Twitch with pro caster commentary and gaming peripherals.")
                .category(EventCategory.SPORTS)
                .date("25 Oct 2026")
                .eventDate(LocalDateTime.of(2026, 10, 25, 10, 0))
                .location("Digital Gaming Hub")
                .venueDetails("Computer Center Hall 2")
                .price("₹149")
                .priceAmount(149.0)
                .capacity(320)
                .remainingTickets(260)
                .organizerName("CSI Student Chapter")
                .organizer(csiOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(true)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event8);

        Event event9 = Event.builder()
                .title("Figma UI/UX Design Sprint")
                .description("Master modern product design, component systems, and interactive prototyping with lead designers from top agencies.")
                .category(EventCategory.WORKSHOP)
                .date("05 Nov 2026")
                .eventDate(LocalDateTime.of(2026, 11, 5, 13, 0))
                .location("Design Studio 402")
                .venueDetails("Architecture & Design Block Floor 4")
                .price("Free")
                .priceAmount(0.0)
                .capacity(150)
                .remainingTickets(120)
                .organizerName("CSI Student Chapter")
                .organizer(csiOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event9);

        Event event10 = Event.builder()
                .title("Campus Startup Pitchfest")
                .description("Student founders pitch innovative ventures directly to Angel Investors and Venture Capitalists for seed funding.")
                .category(EventCategory.SEMINAR)
                .date("12 Nov 2026")
                .eventDate(LocalDateTime.of(2026, 11, 12, 10, 0))
                .location("Incubation Center")
                .venueDetails("E-Cell Seminar Hall")
                .price("Free")
                .priceAmount(0.0)
                .capacity(250)
                .remainingTickets(215)
                .organizerName("IEEE Student Chapter")
                .organizer(ieeeOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event10);

        Event event11 = Event.builder()
                .title("Stargazing & Astronomy Night")
                .description("Night sky observation featuring high-powered telescopes, celestial photography workshops, and deep-space discussions.")
                .category(EventCategory.SEMINAR)
                .date("20 Nov 2026")
                .eventDate(LocalDateTime.of(2026, 11, 20, 19, 0))
                .location("Observatory Deck")
                .venueDetails("Science Block Terrace Deck")
                .price("Free")
                .priceAmount(0.0)
                .capacity(180)
                .remainingTickets(145)
                .organizerName("Music Club")
                .organizer(musicOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event11);

        Event event12 = Event.builder()
                .title("Street Play & Nukkad Natak Fest")
                .description("Powerful social impact theatre performances, drum rhythms, and expressive street drama competitions.")
                .category(EventCategory.CULTURAL_FEST)
                .date("01 Dec 2026")
                .eventDate(LocalDateTime.of(2026, 12, 1, 15, 0))
                .location("Campus Quadrangle")
                .venueDetails("Central Fountain Plaza Quad")
                .price("Free")
                .priceAmount(0.0)
                .capacity(450)
                .remainingTickets(410)
                .organizerName("Music Club")
                .organizer(musicOrganizer)
                .imageUrl("https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=800&auto=format&fit=crop")
                .status(EventStatus.PUBLISHED)
                .isFeatured(false)
                .schedule(new ArrayList<>(standardSchedule))
                .build();
        eventRepository.save(event12);

        // 5. Seed sample bookings for the student
        Booking booking1 = Booking.builder()
                .bookingReference("KAIROS-1-DEMO001")
                .user(student)
                .event(event1)
                .numberOfTickets(1)
                .totalAmount(0.0)
                .attendeeName(student.getName())
                .attendeeEmail(student.getEmail())
                .attendeePhone(student.getPhone())
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(PaymentStatus.FREE)
                .paymentMethod("FREE_PASS")
                .ticketQrCode("KAIROS-TICKET-DEMO-001")
                .bookedAt(LocalDateTime.now().minusDays(2))
                .build();
        bookingRepository.save(booking1);

        Booking booking2 = Booking.builder()
                .bookingReference("KAIROS-2-DEMO002")
                .user(student)
                .event(event2)
                .numberOfTickets(1)
                .totalAmount(199.0)
                .attendeeName(student.getName())
                .attendeeEmail(student.getEmail())
                .attendeePhone(student.getPhone())
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(PaymentStatus.PAID)
                .paymentMethod("ONLINE_UPI")
                .ticketQrCode("KAIROS-TICKET-DEMO-002")
                .bookedAt(LocalDateTime.now().minusDays(1))
                .build();
        bookingRepository.save(booking2);
    }
}
