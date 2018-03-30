Number.prototype.zeroPad = function() {
  return ('0'+this).slice(-2);
};

// The id value is only a unique identifier and does not imply consecutive order.
const SCHEDULE = [
  {
    id: 0,
    name: "Registration Open",
    location: "Mapbox 3rd Floor",
    startTime: "2018-03-30 17:00",
    durationInMins: 90
  },
  {
    id: 1,
    name: "Opening Ceremony",
    location: "Theatre Room",
    startTime: "2018-03-30 18:30",
    durationInMins: 60
  },
  {
    id: 3,
    name: "Late Night Snack",
    location: "Kitchen",
    startTime: "2018-03-30 22:30",
    durationInMins: 15
  },
  {
    id: 4,
    name: "Slideshow Karaoke",
    location: null,
    startTime: "2018-03-30 22:45",
    durationInMins: 60
  },
  {
    id: 5,
    name: "Breakfast Served (Panera Bread)",
    location: "Kitchen",
    startTime: "2018-03-31 08:00",
    durationInMins: 30
  },
  {
    id: 6,
    name: "Lunch Served (Potbelly's)",
    location: "Kitchen",
    startTime: "2018-03-31 12:00",
    durationInMins: 30
  },
  {
    id: 7,
    name: "Project Due",
    location: "Virtual",
    startTime: "2018-03-31 14:00",
    durationInMins: 30
  },
  {
    id: 8,
    name: "Technical Check-Ins",
    location: "Theatre Room",
    startTime: "2018-03-31 14:15",
    durationInMins: 60
  },
  {
    id: 9,
    name: "Project Presentations Start",
    location: "Theatre Room",
    startTime: "2018-03-31 14:45",
    durationInMins: 120
  },
  {
    id: 10,
    name: "Judging Session",
    location: "Theatre Room",
    startTime: "2018-03-31 16:15",
    durationInMins: 60
  },
  {
    id: 11,
    name: "Award Ceremony",
    location: "Theatre Room",
    startTime: "2018-03-31 17:00",
    durationInMins: 60
  }
];

var EFFECTIVE_SCHEDULE = SCHEDULE.map(function(event) {
  startTime = moment.tz(event.startTime, "America/New_York");
  event.durationInMins = event.durationInMins>5 ? event.durationInMins-5 : event.durationInMins
  endTime = moment.tz(event.startTime, "America/New_York").add(event.durationInMins, 'm');
  event.startTime = startTime;
  event.endTime = endTime;
  return event;
});

var ID_HACKING_END = 100;

var app = new Vue({
  el: '#app',
  data: {
    displayEvent: {
      name: null,
      location: null,
      startTime: null,
      durationInMin: null,
    },
    currentTime: null,
    targetTime: null,
  },
  computed: {
    seconds() {
      if (this.currentTime === null) return "00";
      var diff = moment.duration(this.targetTime.diff(this.currentTime));
      if (diff < 0) return "00";
      return diff.seconds().zeroPad();
    },
    minutes() {
      if (this.currentTime === null) return "00";
      var diff = moment.duration(this.targetTime.diff(this.currentTime));
      if (diff < 0) return "00";
      return diff.minutes().zeroPad();
    },
    hours() {
      if (this.currentTime === null) return "00";
      var diff = moment.duration(this.targetTime.diff(this.currentTime));
      if (diff < 0) return "00";
      return diff.hours().zeroPad();
    },
    days() {
      if (this.currentTime === null) return "00";
      var diff = moment.duration(this.targetTime.diff(this.currentTime));
      if (diff < 0) return "00";
      return diff.days().zeroPad();
    },
    displayStartTime() {
      return this.displayEvent.startTime === null ? "" : this.displayEvent.startTime.format("h:mma");
    },
    upcoming() {
      if (this.displayEvent.startTime === null) return false;
      return this.displayEvent.startTime.isAfter(this.currentTime);
    },
    soon() {
      if (this.displayEvent.startTime === null) return false;
      var diff = moment.duration(this.displayEvent.startTime.diff(this.currentTime)).asMinutes();
      return diff <=5 && diff > 0;
    },
    nowToggle() {
      if (this.displayEvent.name === null) return true;
      return this.upcoming;
    }
  },
  mounted: function() {
    this.targetTime = EFFECTIVE_SCHEDULE.find(o => o.id === ID_HACKING_END).startTime;
    window.setInterval(() => {
        this.currentTime = moment.tz("America/New_York");
        var vu = this;
        var flag = false;
        EFFECTIVE_SCHEDULE.forEach(function(scheduleItem) {
          var eventStarted = scheduleItem.startTime.isBefore(moment.tz("America/New_York"));
          var eventHasntEnded = scheduleItem.endTime.isAfter(moment.tz("America/New_York"));
          if (eventStarted && eventHasntEnded && scheduleItem.name != vu.displayEvent.name) {
            Push.create(scheduleItem.name, {
              body: scheduleItem.location,
              timeout: 4000,
              onClick: function () {
                  window.focus();
                  this.close();
              }
            });
            if (scheduleItem.durationInMins != 0) {
              vu.displayEvent = scheduleItem;
              flag = true;
            }
          }
        });
        if (!flag) {
          var oldName = vu.displayEvent.name;
          EFFECTIVE_SCHEDULE.forEach(function(scheduleItem) {
            var eventHasntStarted = scheduleItem.startTime.isAfter(moment.tz("America/New_York"));
            var diff = vu.displayEvent.startTime === null ? -1 : scheduleItem.startTime.diff(vu.displayEvent.startTime);
            diff = scheduleItem.durationInMins == 0 ? 1 : diff;
            if (eventHasntStarted && diff < 0) {
              vu.displayEvent = scheduleItem;
            }
          });
          if (oldName != vu.displayEvent.name) {
            Push.create(vu.displayEvent.startTime.format('hh:mma') + " - " + vu.displayEvent.name, {
              body: vu.displayEvent.location,
              timeout: 4000,
              onClick: function () {
                  window.focus();
                  this.close();
              }
            });
          }
        }
    }, 1000);
  }
});
