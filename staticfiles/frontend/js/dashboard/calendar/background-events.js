var CalendarBackgroundEvents = {
    init: function() {
        var e = moment().startOf("day"),
            t = e.format("YYYY-MM"),
            i = e.clone().subtract(1, "day").format("YYYY-MM-DD"),
            r = e.format("YYYY-MM-DD"),
            o = e.clone().add(1, "day").format("YYYY-MM-DD");
        $("#m_calendar").fullCalendar({
            isRTL: mUtil.isRTL(),
            header: {
                left: "prev,next today",
                center: "title",
                right: "month,agendaWeek,agendaDay,listWeek"
            },
            editable: !0,
            eventLimit: !0,
            navLinks: !0,
            businessHours: !0,
            events: [{
                title: "All Day Event",
                start: t + "-01",
                description: "Lorem ipsum dolor sit incid idunt ut",
                className: "m-fc-event--danger m-fc-event--solid-success"
            }, {
                title: "Reporting",
                start: t + "-14T13:30:00",
                description: "Lorem ipsum dolor incid idunt ut labore",
                end: t + "-14",
                className: "m-fc-event--accent",
                constraint: "businessHours"
            }, {
                title: "Company Trip",
                start: t + "-02",
                description: "Lorem ipsum dolor sit tempor incid",
                end: t + "-03",
                className: "m-fc-event--light m-fc-event--solid-primary"
            }, {
                title: "Expo",
                start: t + "-03",
                description: "Lorem ipsum dolor sit tempor inci",
                end: t + "-05",
                className: "m-fc-event--primary",
                rendering: "background",
                color: mApp.getColor("accent")
            }, {
                title: "Dinner",
                start: t + "-12",
                description: "Lorem ipsum dolor sit amet, conse ctetur",
                end: t + "-10",
                rendering: "background",
                color: mApp.getColor("info")
            }, {
                id: 999,
                title: "Repeating Event",
                start: t + "-09T16:00:00",
                description: "Lorem ipsum dolor sit ncididunt ut labore",
                className: "m-fc-event--danger",
                color: mApp.getColor("primary")
            }, {
                id: 1e3,
                title: "Repeating Event",
                description: "Lorem ipsum dolor sit amet, labore",
                start: t + "-16T16:00:00"
            }, {
                title: "Conference",
                start: i,
                end: o,
                description: "Lorem ipsum dolor eius mod tempor labore",
                className: "m-fc-event--accent",
                rendering: "background",
                color: mApp.getColor("metal")
            }, {
                title: "Meeting",
                start: r + "T10:30:00",
                end: r + "T12:30:00",
                description: "Lorem ipsum dolor eiu idunt ut labore"
            }, {
                title: "Lunch",
                start: r + "T12:00:00",
                className: "m-fc-event--info",
                description: "Lorem ipsum dolor sit amet, ut labore"
            }, {
                title: "Meeting",
                start: r + "T14:30:00",
                className: "m-fc-event--warning",
                description: "Lorem ipsum conse ctetur adipi scing",
                rendering: "background",
                color: mApp.getColor("warning")
            }, {
                title: "Happy Hour",
                start: r + "T17:30:00",
                className: "m-fc-event--metal",
                description: "Lorem ipsum dolor sit amet, conse ctetur"
            }, {
                title: "Dinner",
                start: r + "T20:00:00",
                description: "Lorem ipsum dolor sit ctetur adipi scing"
            }, {
                title: "Birthday Party",
                start: o + "T07:00:00",
                className: "m-fc-event--primary",
                description: "Lorem ipsum dolor sit amet, scing",
                rendering: "background",
                color: mApp.getColor("focus")
            }, {
                title: "Click for Google",
                url: "http://google.com/",
                start: t + "-28",
                description: "Lorem ipsum dolor sit amet, labore"
            }],
            eventRender: function(e, t) {
                t.hasClass("fc-day-grid-event") ? (t.data("content", e.description), t.data("placement", "top"), mApp.initPopover(t)) : t.hasClass("fc-time-grid-event") ? t.find(".fc-title").append('<div class="fc-description">' + e.description + "</div>") : 0 !== t.find(".fc-list-item-title").lenght && t.find(".fc-list-item-title").append('<div class="fc-description">' + e.description + "</div>")
            }
        })
    }
};
jQuery(document).ready(function() {
    CalendarBackgroundEvents.init()
});