// The 30 projects, in order. id = the number on the map and in the Checklist.
// meta = [stock id, title, author, size, tag], from the print PDF (261103_Print.pdf). meta[1] is the title shown in the map directory.
// lat/lng: leave null for no pin. PLACEHOLDER POSITIONS: every point except 1 is random on Manhattan. Replace with your real coordinates.
// Image for each: images/archive/<id>.jpg. For a different file (a video, say) add  archive: "images/archive/1.mp4"  to that project (#1 has one now).
// The thesis text for each entry lives in text.js.
const PROJECTS = [
  {
    id: 1, lat: 40.7436, lng: -73.9794,
    archive: "images/archive/1.mp4",
    meta: ["#110394138", "Girl on sunset", "oksix", "4981×3744px", "Teenagers"],
    location: "Southeast corner of 31 St and 3 Av, Manhattan"
  },
  {
    id: 2, lat: 40.7708, lng: -73.9849,
    meta: ["#84727309", "African american woman meditating in nature", "mimagephotos", "5417×3539px", "Serenity"],
    location: ""
  },
  {
    id: 3, lat: 40.7704, lng: -73.9835,
    meta: ["#91701682", "Beautiful mature woman standing in front of the river in autumn", "Mila Supinskaya", "3000×2000px", "Seniors"],
    location: ""
  },
  {
    id: 4, lat: 40.7948, lng: -73.9663,
    meta: ["#114865758", "female teen girl stand feel freedom with arms stretched to the sky", "GCapture", "6968×4647px", "Teenagers"],
    location: ""
  },
  {
    id: 5, lat: 40.7221, lng: -73.9959,
    meta: ["#160168732", "Happy woman standing with her back on sunset in nature iwith open hands.", "JenkoAtaman", "5472×3648px", "Joy"],
    location: ""
  },
  {
    id: 6, lat: 40.7433, lng: -73.9938,
    meta: ["#208902185", "Handsome happy young male smiling with curly hair posing in the city park looking at the sky, cross his hands and dreaming. Copy space for your advertising. People, lifestyle and emotion concept", "Z A C", "7096×4457px", "People"],
    location: ""
  },
  {
    id: 7, lat: 40.7189, lng: -74.0029,
    meta: ["#225104832", "Positive nice young woman smiling while standing in the forest and breathing fresh air", "Yakobchuk Olena", "6720×4480px", "Canyons"],
    location: ""
  },
  {
    id: 8, lat: 40.74, lng: -74.0014,
    meta: ["#295522408", "Happy woman standing with her back on sunset in nature .", "JenkoAtaman", "6720×4171px", "People"],
    location: ""
  },
  {
    id: 9, lat: 40.7162, lng: -73.9981,
    meta: ["#312765579", "young woman blowing bubbles in the park", "SHOTPRIME STUDIO", "7952×5304px", "States of Mind"],
    location: ""
  },
  {
    id: 10, lat: 40.7815, lng: -73.9716,
    meta: ["#315909169", "Image of young woman wearing hat and plaid shirt walking outdoors", "Drobot Dean", "7952×5304px", "People"],
    location: ""
  },
  {
    id: 11, lat: 40.764, lng: -73.9686,
    meta: ["#317500949", "A male hiker standing on the mountain", "Berlin23", "5168×3448px", "Travel"],
    location: ""
  },
  {
    id: 12, lat: 40.7326, lng: -73.9914,
    meta: ["#322620981", "A young woman enjoying the sunset in the field", "oksix", "5616×3744px", "Landscapes"],
    location: ""
  },
  {
    id: 13, lat: 40.7294, lng: -74.0075,
    meta: ["#322945147", "Close-up outdoor portrait of happy young brunette woman with closed eyes with blowing hair, wearing grey sweater, posing on nature background. Pretty female posing against the lake.", "Z A C", "7360×4912px", "People"],
    location: ""
  },
  {
    id: 14, lat: 40.7551, lng: -73.9784,
    meta: ["#352311753", "Smiling young woman enjoying a sunny day in the park", "mavoimages", "6046×4035px", "People"],
    location: ""
  },
  {
    id: 15, lat: 40.7775, lng: -73.9825,
    meta: ["#430121734", "Relaxed woman breathing fresh air in a green forest", "PheelingsMedia", "5472×3648px", "Lifestyle"],
    location: ""
  },
  {
    id: 16, lat: 40.744, lng: -73.9814,
    meta: ["#449176770", "Woman relaxing in nature on a sunny autumn day", "Impact Photography", "5472×3648px", "Hobbies and Leisure"],
    location: ""
  },
  {
    id: 17, lat: 40.7192, lng: -74.0029,
    meta: ["#454194283", "Beautiful young relaxed woman in white blouse enjoying nature breathing fresh air meditating on the river on an autumn day", "olezzo", "7952×5304px", "People"],
    location: ""
  },
  {
    id: 18, lat: 40.777, lng: -73.979,
    meta: ["#481440323", "Rear view at young pregnant woman in the field", "BGStock72", "6720×3840px", "People"],
    location: ""
  },
  {
    id: 19, lat: 40.7842, lng: -73.9647,
    meta: ["#491724394", "Enjoying the peace and tranquility of her garden. Shot of a senior woman enjoying the outdoors.", "D M/peopleimages.com", "6046×4035px", "People"],
    location: ""
  },
  {
    id: 20, lat: 40.7631, lng: -73.9815,
    meta: ["#492138207", "When life smiles at you, smile back. Shot of a man standing outside with his arms outstretched in delight.", "Tasneem H/peopleimages.com", "6046×4035px", "Landscapes"],
    location: ""
  },
  {
    id: 21, lat: 40.7851, lng: -73.9655,
    meta: ["#492867432", "Shes a happy camper. A beautiful young woman smiling outdoors.", "Jeff Bergen/peopleimages.com", "7285×4862px", "People"],
    location: ""
  },
  {
    id: 22, lat: 40.7229, lng: -73.9969,
    meta: ["#498427752", "Focused on fitness. Shot of a man stretching before a run.", "Lucinda D B/peopleimages.com", "7360×4912px", "Sports"],
    location: ""
  },
  {
    id: 23, lat: 40.7301, lng: -73.9872,
    meta: ["#505892215", "Beautiful young woman enjoying spring in the park", "pikselstock", "5472×3648px", "People"],
    location: ""
  },
  {
    id: 24, lat: 40.7824, lng: -73.9782,
    meta: ["#536495300", "Happy, black woman and summer travel happiness of a person in nature. Portrait of a person from Texas with a smile feeling holiday freedom from traveling in the countryside on vacation break", "S Fanti/peopleimages.com", "7934×5292px", "Landscapes"],
    location: ""
  },
  {
    id: 25, lat: 40.7652, lng: -73.972,
    meta: ["#561312753", "Head shot portrait close up of one middle age old woman resting and relaxing doing yoga in the forest of mountain in the nature. One mature cheerful female person smiling enjoying..", "Daniel", "6240×4160px", "People"],
    location: ""
  },
  {
    id: 26, lat: 40.7482, lng: -73.9841,
    meta: ["#570440265", "Young woman facing ocean sunset rejoices, laughs, smiles looking up to the sky, enjoys life and summer, nature, happiness.", "kieferpix", "6335×4159px", "States of Mind"],
    location: ""
  },
  {
    id: 27, lat: 40.771, lng: -73.9727,
    meta: ["#571467127", "Happy woman raised open arms in flower garden, lifestyle and healthy confidence relax woman concept.", "torjrtrx", "5907×3943px", "People"],
    location: ""
  },
  {
    id: 28, lat: 40.7555, lng: -73.9893,
    meta: ["#597544183", "Portrait of young mature man alone smiling outside with nature trees in background. Environment. Happy people enjoying outdoor leisure activity. Nature feeling. Bearded adult male wearing eyeglasses", "simona", "4000×2667px", "People"],
    location: ""
  },
  {
    id: 29, lat: 40.7888, lng: -73.9701,
    meta: ["#617129012", "Man relaxing lying on the grass. connecting to nature concept.", "Djavan Rodriguez", "6000×4000px", "Hobbies and Leisure"],
    location: ""
  },
  {
    id: 30, lat: 40.7765, lng: -73.9738,
    meta: ["#2015564514", "A young woman in a beige jacket tilts her head back and smiles in a sunlit meadow under a clear sky, capturing a moment of lighthearted outdoor freedom and contentment.", "SHOTPRIME STUDIO", "8192×5464px", "Landscapes"],
    location: ""
  }
];
