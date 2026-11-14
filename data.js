// The 30 projects, in order. id = the number on the map and in the Index.
// title = shown in the map directory and in the list.
// lat/lng: leave null for no pin. PLACEHOLDER POSITIONS: every point except 1 is random on Manhattan. Replace with your real coordinates.
// archive = the image/video shown on the page. Every entry uses the same file for now. For a different file per entry, use images/archive/<id>.jpg
const PROJECTS = [
  {
    id: 1, lat: 40.7436, lng: -73.9794,
    title: "Billy Graham Evangelistic Association",
    archive: "images/archive/1.mp4"
  },
  {
    id: 2, lat: 40.7708, lng: -73.9849,
    title: "How to Build a Life Worth Living with DBT",
    archive: "images/archive/1.mp4"
  },
  {
    id: 3, lat: 40.7704, lng: -73.9835,
    title: "Life After AA: Exploring All Paths to Recovery",
    archive: "images/archive/1.mp4"
  },
  {
    id: 4, lat: 40.7948, lng: -73.9663,
    title: "RSV in Children: Symptoms, Prevention & Treatment",
    archive: "images/archive/1.mp4"
  },
  {
    id: 5, lat: 40.7221, lng: -73.9959,
    title: "Garden Your Way to Better Health and Nutrition",
    archive: "images/archive/1.mp4"
  },
  {
    id: 6, lat: 40.7433, lng: -73.9938,
    title: "Fayetteville First United Methodist Church: Serving meals and restoring hope",
    archive: "images/archive/1.mp4"
  },
  {
    id: 7, lat: 40.7189, lng: -74.0029,
    title: "Why are masks important? Cloth Face Covering FAQs",
    archive: "images/archive/1.mp4"
  },
  {
    id: 8, lat: 40.74, lng: -74.0014,
    title: "Holiday Healthy Eating Tips to Avoid Weight Gain",
    archive: "images/archive/1.mp4"
  },
  {
    id: 9, lat: 40.7162, lng: -73.9981,
    title: "Understand Ketamine for CRPS & Arachnoiditis",
    archive: "images/archive/1.mp4"
  },
  {
    id: 10, lat: 40.7815, lng: -73.9716,
    title: "What Is the Definition of Sobriety? What It Really Means",
    archive: "images/archive/1.mp4"
  },
  {
    id: 11, lat: 40.764, lng: -73.9686,
    title: "Optimize Your Circadian Rhythm With Ideal Light Exposure",
    archive: "images/archive/1.mp4"
  },
  {
    id: 12, lat: 40.7326, lng: -73.9914,
    title: "Visions 2023: The Crayon Perspective",
    archive: "images/archive/1.mp4"
  },
  {
    id: 13, lat: 40.7294, lng: -74.0075,
    title: "63 Free Happy Life Images & Photos",
    archive: "images/archive/1.mp4"
  },
  {
    id: 14, lat: 40.7551, lng: -73.9784,
    title: "Skillfinder International-Precision Hiring",
    archive: "images/archive/1.mp4"
  },
  {
    id: 15, lat: 40.7775, lng: -73.9825,
    title: "Susie Rathbone Hypnotherapist",
    archive: "images/archive/1.mp4"
  },
  {
    id: 16, lat: 40.744, lng: -73.9814,
    title: "Community Support Fuels Quality Heart Care",
    archive: "images/archive/1.mp4"
  },
  {
    id: 17, lat: 40.7192, lng: -74.0029,
    title: "The Importance of Taking Initiative and Being Proactive",
    archive: "images/archive/1.mp4"
  },
  {
    id: 18, lat: 40.777, lng: -73.979,
    title: "Life Images",
    archive: "images/archive/1.mp4"
  },
  {
    id: 19, lat: 40.7842, lng: -73.9647,
    title: "Blue Sky Counseling",
    archive: "images/archive/1.mp4"
  },
  {
    id: 20, lat: 40.7631, lng: -73.9815,
    title: "IV Therapy for Hangovers: A Swift Revival for Post-Celebration Blues",
    archive: "images/archive/1.mp4"
  },
  {
    id: 21, lat: 40.7851, lng: -73.9655,
    title: "10 Things To Be Thankful For As You Enter A New Chapter Of Your Life",
    archive: "images/archive/1.mp4"
  },
  {
    id: 22, lat: 40.7229, lng: -73.9969,
    title: "This is the Day",
    archive: "images/archive/1.mp4"
  },
  {
    id: 23, lat: 40.7301, lng: -73.9872,
    title: "All Contract jobs near Germany",
    archive: "images/archive/1.mp4"
  },
  {
    id: 24, lat: 40.7824, lng: -73.9782,
    title: "Irene White Sharpe",
    archive: "images/archive/1.mp4"
  },
  {
    id: 25, lat: 40.7652, lng: -73.972,
    title: "Why High-Achieving Women Stay Stuck (And How to Finally Move)",
    archive: "images/archive/1.mp4"
  },
  {
    id: 26, lat: 40.7482, lng: -73.9841,
    title: "The Secrets of Happiness",
    archive: "images/archive/1.mp4"
  },
  {
    id: 27, lat: 40.771, lng: -73.9727,
    title: "New year, new you: how to set intentions based on your sign",
    archive: "images/archive/1.mp4"
  },
  {
    id: 28, lat: 40.7555, lng: -73.9893,
    title: "Public Domain Pictures",
    archive: "images/archive/1.mp4"
  },
  {
    id: 29, lat: 40.7888, lng: -73.9701,
    title: "Therapeutic Plasma Exchange",
    archive: "images/archive/1.mp4"
  },
  {
    id: 30, lat: 40.7765, lng: -73.9738,
    title: "Awesome Day of the Lord: Religious Education",
    archive: "images/archive/1.mp4"
  }
];
