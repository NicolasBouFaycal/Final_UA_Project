import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuService } from '../Services/menu.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/Modules/UserManagement/Services/authentication.service';
import { Subscription, fromEvent, interval, takeWhile } from 'rxjs';
@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapPageComponent implements OnInit {
  public latLong:any={lat:0,lng:0};
  public userRole:any;
  items!: MenuItem[];
  leftSidebarVisible: boolean = false;
  rightSidebarVisible: boolean = false;
  mapLoaded!: boolean;
  map!: google.maps.Map;
  center!: google.maps.LatLngLiteral;
 
  private currentLocation:any = null;
  private _subscription!: Subscription;
  source!: google.maps.LatLngLiteral;
  destination!: google.maps.LatLngLiteral;
  clickedLocationMarker: google.maps.Marker | undefined;
  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    zoom: 12
  }
  infoWindow: google.maps.InfoWindow | null = null;
  clickedOnBusStop = true;
  ds!: google.maps.DirectionsService;
  dr!: google.maps.DirectionsRenderer;
  createdMarkers: google.maps.Marker[] = [];
  clickEventListener!: google.maps.MapsEventListener;
  saveBusStopLongLat: any;
  private busStops: google.maps.Marker[] = [];
  private routeCoordinates: any;
  private BusStops: any;
  activeItem: MenuItem | import("primeng/api").MegaMenuItem | undefined;

  constructor(private _authenticaitonService:AuthenticationService,private http: HttpClient, private menu: MenuService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  ngOnInit() {
    this._authenticaitonService.loginUser.subscribe((respnse:any)=>{
      this.userRole=respnse;
    });
    this.items = this.menu.menuModel();

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    });

    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.initializeMap();
      this.drawStaticRoute();
      //draw current Location;

      // var currentLocation = new google.maps.Marker({
      //   position: this.center,
      //   map: this.map,
      //   title: 'Your Location'
      // });


      //chage lat and log for any marker , loive tracking.

      // setInterval(() => {
      //   // Update latitude and longitude by adding a small value (e.g., 0.001)
      //   this.center.lat += 0.001;
      //   this.center.lng += 0.001;

      //   // Set the updated position to the marker
      //   currentLocation.setPosition(this.center);
      // }, 1000); // Update every 1000 milliseconds (1 second)

      // this.createdMarkers.forEach((marker: { getPosition: () => any; }, index: number) => {
      //   console.log(`Marker ${index + 1} position:`, marker.getPosition());
      //   // Perform actions with each marker as needed
      // });

      this.source = {
        lat: 37.4220656,
        lng: -122.0840897
      };

      this.destination = {
        lat: 37.342226,
        lng: -122.0256165
      };

      this.map.addListener('tilesloaded', () => {
        this.mapLoaded = true;
      });
      // adding a marker
      var markerStart = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/imgs/truck_pin.svg',
          anchor: new google.maps.Point(35, 10),
          scaledSize: new google.maps.Size(100, 100)
        },
        map: this.map
      });

      var destinationMarker = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: './assets/imgs/destination_custom_pin.svg',
          anchor: new google.maps.Point(35, 10),
          scaledSize: new google.maps.Size(100, 100)
        },
        map: this.map
      });

      //this.setRoutePolyline(this.source,this.destination);

      this.map.setCenter(this.center);

      this.updateBusLocation();
    });
  }
  public confirm() {
    const dummyElement = document.createElement('div');
    this.confirmationService.confirm({
      target: dummyElement,
      message: 'Do you want to go to this bus station location from your current location?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Check For Route' });
        this.CalculateDirectionToBusStation();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        this.RemoveDirection();
      },

    });
  }


  public setRoutePolyline(source: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) {
    let request = {
      origin: source,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(), // Set the departure time for real-time traffic data
        trafficModel: google.maps.TrafficModel.BEST_GUESS // Choose the appropriate traffic model
      }
    };

    var currentLocation = new google.maps.Marker({
      position: this.center,
      map: this.map,
      title: 'Your Current Location'
    });

    this.ds.route(request, (response, status) => {
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map,
        preserveViewport: true // Set to true to prevent automatic zoom/pan
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.dr.setDirections(response);
        // Extract and display the estimated duration
        if (response != null) {
          const durationSeconds = response.routes[0].legs[0].duration!.value;
          const durationMinutes = Math.ceil(durationSeconds / 60);

          console.log(`Estimated duration: ${durationMinutes} minutes`);

          // Display the estimated duration on the map (e.g., in an info window)
          const infoWindow = new google.maps.InfoWindow({
            content: `Estimated duration: ${durationMinutes} minutes`
          });

          // Open the info window at the midpoint of the route
          const route = response.routes[0];
          const bounds = new google.maps.LatLngBounds();
          route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
              step.path.forEach((point) => {
                bounds.extend(point);
              });
            });
          });
          bounds.extend(new google.maps.LatLng(source));
          bounds.extend(new google.maps.LatLng(destination));

          // Fit the map to the calculated bounds
          this.map.fitBounds(bounds);

          const minZoom = 15;
          if (this.map.getZoom()! > minZoom) {
            this.map.setZoom(minZoom);
          }
          const midpointIndex = Math.floor(route.overview_path.length / 2);
          const midpointLocation = route.overview_path[midpointIndex];          //const midpoint = bounds.getCenter();
          //infoWindow.setPosition(midpoint);
          infoWindow.setPosition(midpointLocation);
          infoWindow.open(this.map);//used when we need to show the estimated time on the maps route

          // const trafficLayer = new google.maps.TrafficLayer();
          // trafficLayer.setMap(this.map);
        }
      }
    })
  }
  public setMapMarkers() {
    //insert markers and create a popup with there specific long  lat
    if (this.clickEventListener) {
      google.maps.event.removeListener(this.clickEventListener);
    }
    this.clickEventListener = this.map.addListener('click', (event: { latLng: any; }) => {
      // Create a new marker at the clicked location
      this.clickedLocationMarker = new google.maps.Marker({
        position: event.latLng,
        map: this.map,
        title: 'Clicked Location'
      });
      console.log(event.latLng);
      console.log(this.clickedLocationMarker);
      this.createdMarkers.push(this.clickedLocationMarker);
      google.maps.event.addListener(this.clickedLocationMarker, 'click', () => {
        // You can customize the content of the infowindow here
        const infoWindowContent = `<div><strong>Marker Details</strong><br/>Lat: ${event.latLng.lat()}<br/>Lng: ${event.latLng.lng()}</div>`;

        // Create and open an infowindow with the details
        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent
        });

        infoWindow.open(this.map, this.clickedLocationMarker);
      });
    });
  }
  public drawStaticRoute() {
    // Example coordinates for the route
    this.http.get("https://localhost:7103/api/Buses/routes").subscribe((response: any) => {
      this.routeCoordinates = response.message.map((groupedRoute: any) => {
        return groupedRoute.routeStops.map((routeStop: any) => ({
          lat: routeStop.routeLatitude,
          lng: routeStop.routeLongitude,
        }));
      });
      this.BusStops = response.message.map((groupedRoute: any) => {
        return groupedRoute.routeStops.map((routeStop: any) => ({
          lat: routeStop.busStopLatitude,
          lng: routeStop.busStopLongitude,
        }));
      });
      for (const routeCoordinate of this.routeCoordinates) {
        // Create a Polyline with the specified coordinates
        const routePolyline = new google.maps.Polyline({
          path: routeCoordinate,
          geodesic: true,
          strokeColor: '#FF0000', // Color of the route line
          strokeOpacity: 1.0,
          strokeWeight: 4,
          // Thickness of the route line
          map: this.map
        });
      }
      for (const BusStop of this.BusStops) {
        this.CreateBusStops(BusStop);
      }
    });

    // const routeCoordinates = [
    //   { lat: 33.89375720009157, lng: 35.550903243838526 },
    //   { lat: 33.89417919761444, lng: 35.5487859249115 },
    //   { lat: 33.89472175224164, lng: 35.54696823661286 },
    //   { lat: 33.895269788499476, lng: 35.544723434104505 },
    //   { lat: 33.895675333144474, lng: 35.54320489105064 },
    //   { lat: 33.89665082503735, lng: 35.53928308880129 },
    //   { lat: 33.89748382002277, lng: 35.53608754608829 },
    //   { lat: 33.89849485311016, lng: 35.531766924560614 },
    //   { lat: 33.89942647082, lng: 35.527026428718344 },
    // ];
    // Calculate the bounds based on route coordinates
    //const bounds = new google.maps.LatLngBounds();
    //routeCoordinate.forEach((coord: { lat: number | google.maps.LatLng | google.maps.LatLngLiteral; lng: number | boolean | null | undefined; }) => bounds.extend(new google.maps.LatLng(coord.lat, coord.lng)));

    // Set the map viewport to fit the calculated bounds
    //this.map.fitBounds(bounds);

    // Optionally, you can set a minimum zoom level to prevent the map from zooming too close
    const maxZoom = 15;
    const zoom = this.map.getZoom() || 0;
    this.map.setZoom(Math.min(zoom, maxZoom));
  }

  public CreateBusStops(routeCoordinates: google.maps.LatLngLiteral[]) {
    routeCoordinates.forEach((coordinate, index) => {
      // For simplicity, create a bus stop marker at every coordinate
      const busStopMarker = new google.maps.Marker({
        position: coordinate,
        map: this.map,
        title: `Bus Stop ${index + 1}`
      });

      // Store the marker in the busStops array
      this.busStops.push(busStopMarker);

      // Attach a click event listener to the bus stop marker
      google.maps.event.addListener(busStopMarker, 'click', (event: any) => {
        this.infoWindow?.close();
        const busStopCoordinates = busStopMarker.getPosition();
        //const infoWindowContent = `<div><strong>Marker Details</strong><br/>Lat: ${busStopCoordinates?.lat()}<br/>Lng: ${busStopCoordinates?.lng()}</div>`;
        const infoWindowContent = `<div><strong>Bus Details</strong><br/><b>Name:</b> Michel<br/><b>Passengers Number:</b> 4</div>`;

        // Create and open an infowindow with the details
        this.infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent
        });
        this.infoWindow.open(this.map, busStopMarker);
        // Handle bus stop click event, e.g., display information or perform an action
        this.clickedOnBusStop = false;
        this.saveBusStopLongLat = {
          lat: busStopCoordinates?.lat(),
          lng: busStopCoordinates?.lng()
        };
        this.confirm();
      });
    });
  }

  public CalculateDirectionToBusStation() {
    this.setRoutePolyline(this.center, this.saveBusStopLongLat)
  }

  public RemoveDirection() {
    this.infoWindow?.close();
    this.clickedOnBusStop = true;
  }

  public ViewBusOnMap(id: number) {
    this.leftSidebarVisible = false;
    this.drawStaticRoute();

  }
  private initializeMap(): void {
    const mapCanvas = document.getElementById('map-canvas');

    if (mapCanvas) {
      this.map = new google.maps.Map(mapCanvas, {
        ...this.options,
        center: this.center,
        zoom: 10,
        zoomControl: true, // Enable zoom control
        mapTypeControl: true, // Optionally, disable map type control
        //streetViewControl: true // Optionally, disable street view control

      });
    } else {
      console.error('Map canvas element not found.');
    }
  }
  private updateBusLocation() {
    let newLocation;
    navigator.geolocation.watchPosition(
      position => {
        newLocation = { lng: position.coords.longitude, lat: position.coords.latitude };
        this.latLong=newLocation;
      }
    );
  }
}