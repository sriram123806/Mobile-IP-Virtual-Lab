/* Schematic Tamil Nadu outline (lon,lat) and real city coordinates (lat,lon). Not survey-accurate. */
window.MIP_MAP={
  outline:[[80.3,13.55],[79.6,13.4],[79.2,13.5],[78.7,13.2],[78.3,12.9],[78.0,12.6],[77.8,12.8],[77.6,12.6],[77.7,12.1],[77.5,11.8],[77.4,11.4],[77.0,11.4],[76.6,11.5],[76.2,11.3],[76.4,10.9],[76.8,10.7],[77.2,10.3],[77.3,9.9],[77.2,9.5],[77.4,9.1],[77.3,8.6],[77.2,8.3],[77.5,8.08],[77.9,8.4],[78.1,8.9],[78.4,9.2],[78.9,9.3],[79.3,9.3],[79.1,9.7],[78.9,10.0],[79.2,10.3],[79.8,10.3],[79.8,10.7],[79.85,11.1],[79.8,11.5],[79.75,11.95],[80.1,12.5],[80.3,13.0]],
  cities:[
    {n:'Chennai',lat:13.0827,lon:80.2707},{n:'Coimbatore',lat:11.0168,lon:76.9558},{n:'Madurai',lat:9.9252,lon:78.1198},
    {n:'Tiruchirappalli',lat:10.7905,lon:78.7047},{n:'Salem',lat:11.6643,lon:78.146},{n:'Tirunelveli',lat:8.7139,lon:77.7567},
    {n:'Kanyakumari',lat:8.0883,lon:77.5385},{n:'Vellore',lat:12.9165,lon:79.1325},{n:'Thanjavur',lat:10.787,lon:79.1378},
    {n:'Kumbakonam',lat:10.9602,lon:79.3845},{n:'Erode',lat:11.341,lon:77.7172},{n:'Thoothukudi',lat:8.7642,lon:78.1348},
    {n:'Rameswaram',lat:9.2876,lon:79.3129},{n:'Udhagamandalam (Ooty)',lat:11.4102,lon:76.695},{n:'Hosur',lat:12.7409,lon:77.8253},
    {n:'Cuddalore',lat:11.748,lon:79.7714},{n:'Dindigul',lat:10.3673,lon:77.9803},{n:'Nagercoil',lat:8.1833,lon:77.4119}],
  project:function(lat,lon){return {x:30+(lon-76)*100,y:30+(13.7-lat)*100};}
};
