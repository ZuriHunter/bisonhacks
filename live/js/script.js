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
    name: "Team Mixer",
    location: "MAC Stage",
    startTime: "2018-02-03 11:45",
    durationInMins: 15
  },
  {
    id: 4,
    name: "Hacking Begins",
    location: null,
    startTime: "2018-02-03 12:00",
    durationInMins: 0
  },
  {
    id: 5,
    name: "Lunch",
    location: "MAC Lobby",
    startTime: "2018-02-03 12:00",
    durationInMins: 60
  },
  {
    id: 6,
    name: "Intro to Computational Linguistics",
    location: "Baker 114",
    startTime: "2018-02-03 13:00",
    durationInMins: 60
  },
  {
    id: 7,
    name: "Getting Started with Google Cloud Platform",
    location: "Baker 114",
    startTime: "2018-02-03 14:00",
    durationInMins: 60
  },
  {
    id: 8,
    name: "Intro to Game Development",
    location: "Baker 114",
    startTime: "2018-02-03 15:00",
    durationInMins: 60
  },
  {
    id: 9,
    name: "Networking with APIs in iOS",
    location: "Baker 114",
    startTime: "2018-02-03 16:00",
    durationInMins: 60
  },
  {
    id: 10,
    name: "Microcontroller Programming",
    location: "Baker 114",
    startTime: "2018-02-03 17:00",
    durationInMins: 60
  },
  {
    id: 11,
    name: "Hacking Your Way to a Career",
    location: "Baker 114",
    startTime: "2018-02-03 18:00",
    durationInMins: 60
  },
  {
    id: 12,
    name: "Dinner",
    location: "MAC Lobby",
    startTime: "2018-02-03 19:00",
    durationInMins: 60
  },
  {
    id: 13,
    name: "Lean In Circle",
    location: "Baker 114",
    startTime: "2018-02-03 20:00",
    durationInMins: 60
  },
  {
    id: 14,
    name: "Cup Stacking",
    location: "MAC Lobby",
    startTime: "2018-02-03 21:00",
    durationInMins: 60
  },
  {
    id: 15,
    name: "Midnight Snack",
    location: "MAC Lobby",
    startTime: "2018-02-04 00:00",
    durationInMins: 30
  },
  {
    id: 16,
    name: "Saurik Says Something Serious",
    location: "MAC Lobby",
    startTime: "2018-02-04 00:30",
    durationInMins: 60
  },
  {
    id: 17,
    name: "Breakfast",
    location: "MAC Lobby",
    startTime: "2018-02-04 08:00",
    durationInMins: 60
  },
  {
    id: 18,
    name: "Devpost Submissions",
    location: "Devpost",
    startTime: "2018-02-04 10:30",
    durationInMins: 15
  },
  {
    id: 19,
    name: "Lunch",
    location: "MAC Lobby",
    startTime: "2018-02-04 11:30",
    durationInMins: 30
  },
  {
    id: 100,
    name: "Hacking Ends",
    location: null,
    startTime: "2018-02-04 12:00",
    durationInMins: 0
  },
  {
    id: 21,
    name: "Judges Orientation",
    location: "MAC Lobby",
    startTime: "2018-02-04 12:00",
    durationInMins: 30
  },
  {
    id: 22,
    name: "Judging Expo",
    location: "MAC",
    startTime: "2018-02-04 12:30",
    durationInMins: 90
  },
  {
    id: 23,
    name: "Closing Ceremony",
    location: "Phillips Hall (6-124)",
    startTime: "2018-02-04 14:00",
    durationInMins: 60
  }
];

var EFFECTIVE_SCHEDULE = SCHEDULE.map(function(event) {
  startTime = moment.tz(event.startTime, "America/Los_Angeles");
  event.durationInMins = event.durationInMins>5 ? event.durationInMins-5 : event.durationInMins
  endTime = moment.tz(event.startTime, "America/Los_Angeles").add(event.durationInMins, 'm');
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
        this.currentTime = moment.tz("America/Los_Angeles");
        var vu = this;
        var flag = false;
        EFFECTIVE_SCHEDULE.forEach(function(scheduleItem) {
          var eventStarted = scheduleItem.startTime.isBefore(moment.tz("America/Los_Angeles"));
          var eventHasntEnded = scheduleItem.endTime.isAfter(moment.tz("America/Los_Angeles"));
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
            var eventHasntStarted = scheduleItem.startTime.isAfter(moment.tz("America/Los_Angeles"));
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
