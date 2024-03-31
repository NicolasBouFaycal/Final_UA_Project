import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuService } from '../Services/menu.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/Modules/UserManagement/Services/authentication.service';
import { Subscription, fromEvent, interval, takeWhile } from 'rxjs';
import { LoaderService } from 'src/app/Shared/Services/loader-service.service';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapPageComponent implements OnInit,OnDestroy {
  public userRole: Number = 0;
  items!: MenuItem[];
  leftSidebarVisible: boolean = false;
  rightSidebarVisible: boolean = false;
  mapLoaded!: boolean;
  map!: google.maps.Map;
  center!: google.maps.LatLngLiteral;
  public setBusRouteData: Array<any> = []
  public searchBus: string = "";
  public showSeeAllBuses=false; 

  private currentLocation:any;
  private _firstEnterToMapDraw=true;
  private intervalsetSingleBusRoute!:Subscription;
  private _saveSingleRoute:google.maps.LatLngLiteral[]=[];
  private _saveSingleBusStop:google.maps.LatLngLiteral[]=[];
  private _routePolilyne: Array<google.maps.Polyline> = [];
  private getAllActiveBusesSubsription!: Subscription;
  private getBusRouteDataSideMenuSubsription!: Subscription;
  private _anonymousFilterBusRouteData: Array<any> = [];
  private _filterBusRouteData: Array<any> = [{ userName: "", routeName: "", busLng: "", busLat: "", busId: "" }];
  private _allActiveBusesMarkers: Array<google.maps.Marker> = [];
  private _busCurrentLocation!: google.maps.Marker;
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

  constructor(private loaderService: LoaderService,private _authenticaitonService: AuthenticationService, private http: HttpClient, private menu: MenuService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) {
    this.getBusRouteDataSideMenu();
  }

  async ngOnInit() {

    await this.initializeMap();

    this.items = this.menu.menuModel();

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    });
    // if (this._authenticaitonService.getLogedUser() == 2) {
    //   this.updateBusLocation();
    // };

    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.drawStaticRoute();

      this.map.addListener('tilesloaded', () => {
        this.mapLoaded = true;
      });
      this.map.setCenter(this.center);
    });

    navigator.geolocation.watchPosition(position => {
      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
    
   

    this.asyncAllActiveBuses();
    this.asyncBusRouteDataSideMenu();
  }

  public ngOnDestroy(): void {
    this.getAllActiveBusesSubsription.unsubscribe();
    this.getBusRouteDataSideMenuSubsription.unsubscribe();
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

  public getAllActiveBusesAgain(){
    this.showSeeAllBuses=false;
    this.intervalsetSingleBusRoute.unsubscribe();
    this.removeAll();
    this.asyncAllActiveBuses();
    this.drawStaticRoute();
  }


  public setRoutePolyline(source: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) {
    let request = {
      origin: source,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
      drivingOptions: {
        departureTime: new Date(), // Set the departure time for real-time traffic data
        trafficModel: google.maps.TrafficModel.BEST_GUESS // Choose the appropriate traffic model
      }
    };

    var currentLocation = new google.maps.Marker({
      position: this.currentLocation,
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

  public searchBuses(searchBus: string) {
    this.setBusRouteData = this._filterBusRouteData.filter(d => d.userName.includes(searchBus) || d.routeName.includes(searchBus));
  }

  public drawStaticRoute() {
    this.loaderService.show();
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
        this._routePolilyne.push(routePolyline);
      }
      for (const BusStop of this.BusStops) {
        this.CreateBusStops(BusStop);
      }
      this.loaderService.hide();
    });
    // Optionally, you can set a minimum zoom level to prevent the map from zooming too close
    const maxZoom = 15;
    const zoom = this.map.getZoom() || 0;
    this.map.setZoom(Math.min(zoom, maxZoom));
  }

  public drawSingleStaticRoute(routeStopsCoordinates: any) {

    // Create a Polyline with the specified coordinates
    const routePolyline = new google.maps.Polyline({
      path: routeStopsCoordinates,
      geodesic: true,
      strokeColor: '#FF0000', // Color of the route line
      strokeOpacity: 1.0,
      strokeWeight: 4,
      // Thickness of the route line
      map: this.map
    });
    this._routePolilyne.push(routePolyline);

  }

  public CreateBusStops(routeCoordinates: google.maps.LatLngLiteral[]) {
    routeCoordinates.forEach((coordinate, index) => {
      // For simplicity, create a bus stop marker at every coordinate
      const busStopMarker = new google.maps.Marker({
        position: coordinate,
        map: this.map,
        icon: {
          url: '../../../assets/imgs/map/ic-busStop.png',
          scaledSize: new google.maps.Size(30, 30)
        },
        title: `Bus Stop ${index + 1}`
      });

      // Store the marker in the busStops array
      this.busStops.push(busStopMarker);

      // Attach a click event listener to the bus stop marker
      google.maps.event.addListener(busStopMarker, 'click', (event: any) => {
        this.infoWindow?.close();
        const busStopCoordinates = busStopMarker.getPosition();
        //const infoWindowContent = `<div><strong>Marker Details</strong><br/>Lat: ${busStopCoordinates?.lat()}<br/>Lng: ${busStopCoordinates?.lng()}</div>`;
        const infoWindowContent = `<div><strong>Bus Stop ${index + 1}</strong></div>`;

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

  public ViewBusOnMap(busLng: string, busLat: string, busId: string) {
    this.loaderService.show();
    this.showSeeAllBuses=true;
    if(!this._firstEnterToMapDraw){
      this.intervalsetSingleBusRoute.unsubscribe();
    }
    this._firstEnterToMapDraw=false;
    this.getAllActiveBusesSubsription.unsubscribe();
    this.leftSidebarVisible = false;
    let enterfirstTime = true;
    this.removeAll();
    this.intervalsetSingleBusRoute=interval(2000)
      .subscribe(() => { 
        if(enterfirstTime){
          this.refreshBusLocationAndRoute(busId,enterfirstTime);
          enterfirstTime=false;
        }else{
          this.refreshBusLocationAndRoute(busId,enterfirstTime);
        }
      }); 
      this.loaderService.hide();
  }

  private removeAll()
  {
    this._allActiveBusesMarkers.forEach(markerBusData => {
      markerBusData.setMap(null);
    });
    this._allActiveBusesMarkers = [];
    this.busStops.forEach(busStopMarker => {
      busStopMarker.setMap(null);
    })
    this.busStops = [];
    this._routePolilyne.forEach(routePolilyne => {
      routePolilyne.setMap(null);
    })
    this._routePolilyne = [];
  }

  private refreshBusLocationAndRoute(busId:any,enterFirstTime:boolean){
    this.http.get(`https://localhost:7103/api/Buses/specificBusDetails?busId=${busId}`).subscribe((response: any) => {
      if(!this.areLatLngArraysEqual(this._saveSingleRoute,response.message.routeStopsCoordinates)){
        this._saveSingleRoute=response.message.routeStopsCoordinates;
        this.drawSingleStaticRoute(response.message.routeStopsCoordinates);
      }
      if(!this.areLatLngArraysEqual(this._saveSingleBusStop,response.message.busStopsCoordinates)){
        this._saveSingleBusStop=response.message.busStopsCoordinates;
        this.CreateBusStops(response.message.busStopsCoordinates);
      }
      this.setSingleBusMarker(Number(response.message.busCoordinates.lat),Number(response.message.busCoordinates.lng),response.message.busCoordinates.nbOfPassengers,response.message.busCoordinates.name,enterFirstTime);
      let BusPosition: google.maps.LatLngLiteral = { lat: Number(response.message.lat), lng: Number(response.message.lng) }
      const marker = new google.maps.Marker({
        position: BusPosition,
      });
    })
  }

  private areLatLngArraysEqual(arr1: google.maps.LatLngLiteral[], arr2: google.maps.LatLngLiteral[]): boolean {
    // Check if the arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Compare arrays element by element
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].lat !== arr2[i].lat || arr1[i].lng !== arr2[i].lng) {
            return false;
        }
    }

    return true;
}

  private setSingleBusMarker(lat:number,lng:number,nbOfPassenger:string,name:string,enterFirstTime:boolean){
    let BusPosition: google.maps.LatLngLiteral = { lat: lat, lng: lng }
    const currentBus = new google.maps.Marker({
      position: BusPosition,
      icon: {
        url: './assets/imgs/bus.png',
        anchor: new google.maps.Point(35, 10),
        scaledSize: new google.maps.Size(50, 50)
      },
      map: this.map,
    });
    this._allActiveBusesMarkers.push(currentBus);
    
    if(enterFirstTime){
      this.loaderService.hide();
      this.map.setCenter(currentBus.getPosition()!);
      this.map.setZoom(12);
    }
    google.maps.event.addListener(currentBus, 'click', (event: any) => {
      this.infoWindow?.close();
      //const infoWindowContent = `<div><strong>Marker Details</strong><br/>Lat: ${busStopCoordinates?.lat()}<br/>Lng: ${busStopCoordinates?.lng()}</div>`;
      const infoWindowContent = `<div><strong>Bus Details</strong><br/><b>Name:</b> ${name}<br/><b>Passengers Number:</b> ${nbOfPassenger}</div>`;
      // Create and open an infowindow with the details
      this.infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      this.infoWindow.open(this.map, currentBus);
    });
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
  
  private asyncAllActiveBuses(){
    this.getAllActiveBusesSubsription = interval(2000)
    .subscribe(() => {
      this.getAllActiveBuses();
    });
  }

  private setBusLiveMarker(currentLocation: any) {
    if (this._busCurrentLocation) {
      this._busCurrentLocation.setMap(null);
    }
    // For simplicity, create a bus stop marker at every coordinate
    this._busCurrentLocation = new google.maps.Marker({
      position: currentLocation,
      map: this.map,
      title: `Name of the Driver`
    });
    // Attach a click event listener to the bus stop marker
    google.maps.event.addListener(this._busCurrentLocation, 'click', (event: any) => {
      this.infoWindow?.close();
      const busStopCoordinates = this._busCurrentLocation.getPosition();
      //const infoWindowContent = `<div><strong>Marker Details</strong><br/>Lat: ${busStopCoordinates?.lat()}<br/>Lng: ${busStopCoordinates?.lng()}</div>`;
      const infoWindowContent = `<div><strong>Bus Details</strong><br/><b>Name:</b> Michel<br/><b>Passengers Number:</b> 4</div>`;

      // Create and open an infowindow with the details
      this.infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      this.infoWindow.open(this.map, this._busCurrentLocation);
      // Handle bus stop click event, e.g., display information or perform an action
      this.clickedOnBusStop = false;
      this.saveBusStopLongLat = {
        lat: busStopCoordinates?.lat(),
        lng: busStopCoordinates?.lng()
      };
      this.confirm();
    });
  };

  private updateBusLocation() {
    let currentLocation;
    navigator.geolocation.watchPosition(
      position => {
        currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.setBusLiveMarker(currentLocation);
      }
    );
  }

  private getAllActiveBuses() {
    if (this._allActiveBusesMarkers.length !== 0) {
      this._allActiveBusesMarkers = this._allActiveBusesMarkers.filter(marker => {
        marker.setMap(null);
        return false; // Keeps no elements in the filtered array
      });
    }
    this.http.get("https://localhost:7103/api/Buses/buses").subscribe((response: any) => {
      response.message.forEach((element: any) => {
        let latLngBus = { lat: element.latitude, lng: element.longitude }
        const _busCurrentLocation = new google.maps.Marker({
          position: latLngBus,
          icon: {
            url: '../../../assets/imgs/map/ic-busActive.png',
            anchor: new google.maps.Point(35, 10),
            scaledSize: new google.maps.Size(40, 40)
          },
          map: this.map,
          title: element.name
        });
        this._allActiveBusesMarkers.push(_busCurrentLocation);
        // Attach a click event listener to the bus stop marker
        google.maps.event.addListener(_busCurrentLocation, 'click', (event: any) => {
          this.infoWindow?.close();
          //const infoWindowContent = `<div><strong>Marker Details</strong><br/>Lat: ${busStopCoordinates?.lat()}<br/>Lng: ${busStopCoordinates?.lng()}</div>`;
          const infoWindowContent = `<div><strong>Bus Details</strong><br/><b>Name:</b> ${element.name}<br/><b>Passengers Number:</b> ${element.numberOfPassenger}</div>`;
          // Create and open an infowindow with the details
          this.infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
          });
          this.infoWindow.open(this.map, _busCurrentLocation);
        });
      });
    });
  };

  private asyncBusRouteDataSideMenu(){
    this.getBusRouteDataSideMenuSubsription = interval(2000)
    .subscribe(() => {
      this.getBusRouteDataSideMenu();
    });
  }

  private getBusRouteDataSideMenu() {
    this.http.get("https://localhost:7103/api/Buses/busRouteInfo").subscribe((response: any) => {
      this._anonymousFilterBusRouteData = [];
      response.message.forEach((element: any) => {
        this._anonymousFilterBusRouteData.push({ userName: element.userName, routeName: element.routeName, busLng: element.busRouteLong, busLat: element.busRouteLat, busId: element.busId });
      });
      if (!this.arraysHaveSameElements(this._anonymousFilterBusRouteData, this._filterBusRouteData)) {
        console.log("enter");
        this._filterBusRouteData = this._anonymousFilterBusRouteData;
        this.setBusRouteData = this._anonymousFilterBusRouteData;
      }
    })
  }

  private arraysHaveSameElements(arr1: { userName: string; routeName: string }[], arr2: { userName: string; routeName: string }[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];
      if (obj1.userName !== obj2.userName || obj1.routeName !== obj2.routeName) {
        return false;
      }
    }
    return true;
  }
}
