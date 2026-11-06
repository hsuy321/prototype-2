// 34 projects, in order. id = the number on the map and in the text list.
// lat/lng: leave null until you have coordinates (no pin is drawn). Images go in images/projects/.
// The thesis text for each entry lives in text.js.
const PROJECTS = [
  {
    id: 1, lat: 40.7436, lng: -73.9794,
    image: "images/projects/1.jpg",
    archive: "images/archive/1.mp4",
    meta: ["#110394138", "Girl on sunset", "oksix", "4981x3744px", "Teenagers"],
    location: "Southeast corner of 31 St and 3 Av, Manhattan"
  },
  {
    id: 2, lat: null, lng: null,
    image: "images/projects/2.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 3, lat: null, lng: null,
    image: "images/projects/3.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 4, lat: null, lng: null,
    image: "images/projects/4.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 5, lat: null, lng: null,
    image: "images/projects/5.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 6, lat: null, lng: null,
    image: "images/projects/6.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 7, lat: null, lng: null,
    image: "images/projects/7.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 8, lat: null, lng: null,
    image: "images/projects/8.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 9, lat: null, lng: null,
    image: "images/projects/9.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 10, lat: null, lng: null,
    image: "images/projects/10.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 11, lat: null, lng: null,
    image: "images/projects/11.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 12, lat: null, lng: null,
    image: "images/projects/12.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 13, lat: null, lng: null,
    image: "images/projects/13.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 14, lat: null, lng: null,
    image: "images/projects/14.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 15, lat: null, lng: null,
    image: "images/projects/15.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 16, lat: null, lng: null,
    image: "images/projects/16.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 17, lat: null, lng: null,
    image: "images/projects/17.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 18, lat: null, lng: null,
    image: "images/projects/18.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 19, lat: null, lng: null,
    image: "images/projects/19.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 20, lat: null, lng: null,
    image: "images/projects/20.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 21, lat: null, lng: null,
    image: "images/projects/21.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 22, lat: null, lng: null,
    image: "images/projects/22.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 23, lat: null, lng: null,
    image: "images/projects/23.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 24, lat: null, lng: null,
    image: "images/projects/24.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 25, lat: null, lng: null,
    image: "images/projects/25.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 26, lat: null, lng: null,
    image: "images/projects/26.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 27, lat: null, lng: null,
    image: "images/projects/27.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 28, lat: null, lng: null,
    image: "images/projects/28.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 29, lat: null, lng: null,
    image: "images/projects/29.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 30, lat: null, lng: null,
    image: "images/projects/30.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 31, lat: null, lng: null,
    image: "images/projects/31.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 32, lat: null, lng: null,
    image: "images/projects/32.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 33, lat: null, lng: null,
    image: "images/projects/33.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  },
  {
    id: 34, lat: null, lng: null,
    image: "images/projects/34.jpg",
    meta: ["#000000000", "Title", "Author", "0000x0000px", "Tag"],
    location: ""
  }
];
