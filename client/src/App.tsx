import React from 'react';
import './App.scss';
import {createApiClient, Ticket, cloneTicket} from './api';
import { parseConfigFileTextToJson } from 'typescript';

const { v4: uuidv4 } = require('uuid');

export type AppState = {
	tickets?: Ticket[],
	search: string,
	fontsize: number,
	darkMode: boolean,
	currentPage: number,
	totalPages: number;
}

var FontSize = {"SMALL": 14,"NORMAL": 16,"LARGE": 18};
// var pinnedTickets: Ticket[] = [];


const api = createApiClient();

const showHide = (id: string) => {

	var x = document.getElementById(id);
	var text = x!.querySelector(".show-more")!.textContent!.toUpperCase();

	if(text === "SHOW MORE")
	{
		text = "Show less";
		let cont = x!.querySelector(".contentHide")
		cont!.classList.add("contentShow");
		cont!.classList.remove("contentHide");
	} else {
		text = "Show more";
		let cont = x!.querySelector(".contentShow")
		cont!.classList.add("contentHide");
		cont!.classList.remove("contentShow");
	}
	x!.querySelector(".show-more")!.textContent! = text;

}

function checkOverflow(id: string)
{
	let el = document.getElementById(id) as HTMLElement;

	if(document.body.contains(el))
	{
		var curOverflow = el.style.overflow;

		if ( !curOverflow || curOverflow === "visible" )
			el.style.overflow = "hidden";

		var isOverflowing = el.clientWidth < el.scrollWidth 
			|| el.clientHeight < el.scrollHeight;

		el.style.overflow = curOverflow;

		return isOverflowing;
	}
}


function showMoreOverflowCheck()
{
	
	let Elements = document.getElementsByClassName("contentHide") as HTMLCollectionOf<HTMLElement>;

	for(let i = 0; i < Elements.length; i++)
	{
		if(!checkOverflow(Elements[i].id))
		{
			document.getElementById(Elements[i].id+"show")!.style.visibility="hidden";
		}	
	}
}

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		fontsize: FontSize.NORMAL,
		darkMode: true,
		currentPage: 1,
		totalPages: 1,
	}
	

	SVGComponent = () => (
		<svg
		  aria-hidden="true"
		  focusable="false"
		  data-prefix="far"
		  data-icon="clone"
		  className="svg-inline--fa fa-clone fa-w-16"
		  role="img"
		  width="12"
		  viewBox="0 0 512 512"
		>
		  <path
			fill="currentColor"
			d="M464 0H144c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h320c26.51 0 48-21.49 48-48v-48h48c26.51 0 48-21.49 48-48V48c0-26.51-21.49-48-48-48zM362 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h42v224c0 26.51 21.49 48 48 48h224v42a6 6 0 0 1-6 6zm96-96H150a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h308a6 6 0 0 1 6 6v308a6 6 0 0 1-6 6z"
		  />
		</svg>
	  );


	pinComponent = () => (
		<svg
		  aria-hidden="true"
		  focusable="false"
		  data-prefix="far"
		  data-icon="clone"
		  className="bi-pin"
		  role="img"
		  width="16"
		  height="16"
		  viewBox="0 0 16 16"
		  xmlns="http://www.w3.org/2000/svg"
		>
		  <path
			fill="currentColor"
			d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408l-.002-.001zm-.002-.001l.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z"
		  />
		</svg>
	  );
	  
	unPinComponent = () => (
		<svg
		  aria-hidden="true"
		  focusable="false"
		  data-prefix="far"
		  data-icon="clone"
		  className="bi-pin"
		  role="img"
		  width="16"
		  height="16"
		  viewBox="0 0 16 16"
		  xmlns="http://www.w3.org/2000/svg"
		>
		  <path
			fill="currentColor"
			d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.92 5.92 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"
		  />
		</svg>
	  );

	  
	async reloadTickets() {
		  console.log("reloading tickets");
		//   var tempTickets = this.state.tickets!.concat(await api.getTickets(this.state.currentPage));
		  var tempTickets = await api.getTickets(this.state.currentPage);
		  tempTickets.filter((item,index) => tempTickets.indexOf(item) === index);
		  this.setState({
			  tickets: tempTickets
			})
			// await this.forceUpdate();
		}
		
	flipPin = (id: string) => {
			// let tempTicket = this.state.tickets!.find((t) => t.id === id) || false;
			// if(tempTicket && !tempTicket.isPinned)
			// 	pinnedTickets.push(tempTicket);
			// if(tempTicket && tempTicket.isPinned)
			// 	pinnedTickets.splice(pinnedTickets.findIndex((t) => t.id === id),1);
			this.setState({
				tickets: this.state.tickets!.map((tkt) => { if(tkt.id == id) {tkt.isPinned = !tkt.isPinned;} return tkt;})
			})
			
	}

	clone = (id: string) => {

		const toClone = this.state.tickets!.find((t) => t.id === id);
		cloneTicket(toClone);
		this.reloadTickets();
	}
		
	componentDidUpdate () {
			console.log("did update");
			showMoreOverflowCheck();
	}
		
		// async nextPage() {
			// 	if(this.state.currentPage < this.state.totalPages)
			// 	{
				// 		this.setState({
					// 			currentPage: await (this.state.currentPage + 1)
					// 		});
					// 		this.setState({
						// 			// tickets: await pinnedTickets.concat(await (await api.getTickets(this.state.currentPage)).filter((item) => pinnedTickets.indexOf(item) < 0))
						// 			// tickets: await pinnedTickets.concat(await api.getTickets(this.state.currentPage))
						// 			tickets: await api.getTickets(this.state.currentPage)
						// 		})
						// 	}
						// 	if(this.state.currentPage > 1)
						// 	{
							// 		(document.getElementById('prevPage') as HTMLInputElement).disabled = false;
							// 	}
							// 	if(this.state.currentPage === this.state.totalPages)
							// 	{
								// 		(document.getElementById('nextPage') as HTMLInputElement).disabled = true;
								// 	}
								// }
								
	async loadMore() {
		if(this.state.currentPage < this.state.totalPages)
		{
			this.setState({
				currentPage: await (this.state.currentPage + 1)
			});
			this.setState({
				tickets: await api.getTickets(this.state.currentPage),
				totalPages: await api.numOfPages()
			})
		}
		if(this.state.currentPage == this.state.totalPages)
		{
			(document.getElementById('loadMore') as HTMLInputElement).style.visibility = "hidden";
			(document.getElementById('noItemsToShow') as HTMLInputElement).style.visibility = "visible";
		}
	}
								
								// async prevPage() {
									// 	if(this.state.currentPage > 1 )
									// 	{
										// 		this.setState({
											// 			currentPage: await (this.state.currentPage - 1)
											// 		});
											// 		this.setState({
												// 			tickets: await api.getTickets(this.state.currentPage)
												// 		})
												// 	}
												// 	if(this.state.currentPage === 1)
												// 	{
													// 		(document.getElementById('prevPage') as HTMLInputElement).disabled = true;
													// 	}
													// 	if(this.state.currentPage < this.state.totalPages)
													// 	{
														// 		(document.getElementById('nextPage') as HTMLInputElement).disabled = false;
														// 	}
														// }
														
	setFontSize = (size: number) => {
		
		if(size == FontSize.LARGE)
		{
			(document.getElementById('fontLarge') as HTMLInputElement).disabled = true;
			(document.getElementById('fontSmall') as HTMLInputElement).disabled = false;
			(document.getElementById('fontNormal') as HTMLInputElement).disabled = false;
		}
		if(size == FontSize.SMALL)
		{
			(document.getElementById('fontLarge') as HTMLInputElement).disabled = false;
			(document.getElementById('fontSmall') as HTMLInputElement).disabled = true;
			(document.getElementById('fontNormal') as HTMLInputElement).disabled = false;
		}
		if(size == FontSize.NORMAL)
		{
			(document.getElementById('fontLarge') as HTMLInputElement).disabled = false;
			(document.getElementById('fontSmall') as HTMLInputElement).disabled = false;
			(document.getElementById('fontNormal') as HTMLInputElement).disabled = true;
		}
		
		this.setState({
			fontsize: size
		})
	}
	
	darkModeToggle = () => {
		var element = document.body;
		element.classList.toggle("darkMode");
	}
														
	searchDebounce: any = null;
	
	
	
	async componentDidMount() {
		this.setState({
			// tickets: await (await api.getTickets(this.state.currentPage)).map((tkt: Ticket) => {tkt.isPinned = false; return tkt}),
			tickets: await api.getTickets(this.state.currentPage),
			totalPages: await api.numOfPages(),
		});
		
		console.log(this.state);
		
		this.setFontSize(this.state.fontsize);
		// this.prevPage();
		showMoreOverflowCheck();
	}
														
	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets
		.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));
		
		return (<ul className='tickets'>
			{ filteredTickets.filter((t) => (t.isPinned)).map((ticket) => this.ticketComponent(ticket))}
			{ filteredTickets.filter((t) => (!t.isPinned)).map((ticket) => this.ticketComponent(ticket))}
		</ul>);
	}
	
	// 	renderTickets = (tickets: Ticket[]) => {
		// 		// cloneTicket(this.state.tickets![0]);
		// 		const filteredTickets = tickets
		// 			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));
		
		// 		return (<ul className='tickets'>
		// 			{filteredTickets.filter((t) => (t.isPinned)).map((ticket) => (<li key={ticket.id} id={ticket.id}  className='ticket'>
		// 			<nav>
		// 				<div className="column"><h5 className='title' style={{fontSize : this.state.fontsize}}>{ticket.title}</h5></div>
		// 				<div className="column"><a className="clone">{this.SVGComponent()}</a></div> </nav>
		// 				<p className='contentHide' id={ticket.id+"content"} style={{fontSize : this.state.fontsize -2}}>{ticket.content}</p>
		// 				<a href="#/" id={ticket.id+"contentshow"} className="show-more" style={{fontSize : this.state.fontsize-2}} onClick={(e: React.MouseEvent) => {showHide(ticket.id)}}>Show more</a>
		// 				<footer>
		// 				<div className='meta-data'style={{fontSize : this.state.fontsize - 4}}>By <a href={"mailto:"+ticket.userEmail+"?subject=Answer from Wix"+"&body=We read the message you left us titled:\" " + ticket.title + "\""}>{ticket.userEmail}</a> | { new Date(ticket.creationTime).toLocaleString()}</div> 
		// 					<button className='pinButton' onClick={(e: React.MouseEvent) => {this.flipPin(ticket.id)}} type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi-pin" viewBox="0 0 16 16">
		//   <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408l-.002-.001zm-.002-.001l.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z"/>
		// </svg></button>
		// 				</footer>
		// 			</li>))}
		// 			{filteredTickets.filter((t) => (!t.isPinned)).map((ticket) => (<li key={ticket.id} id={ticket.id} className='ticket'>
		// 				<nav>
		// 				<div className="column"><h5 className='title' style={{fontSize : this.state.fontsize}}>{ticket.title}</h5></div>
		// 				<div className="tooltip"><span className="tooltiptext">Clone</span><button className="clone" onClick={() => this.clone(ticket.id)}>{this.SVGComponent()}</button></div> </nav>
		// 				<p className='contentHide' id={ticket.id+"content"}  style={{fontSize : this.state.fontsize-2}}>{ticket.content}</p>
		// 				{/* <a href="#" className="show-more" onClick={(e: React.MouseEvent) => {document.getElementById(ticket.id)!.classList.add("contentShow"); document.getElementById(ticket.id)!.classList.remove("contentHide")}}>Show more</a> */}
		// 				<a href="#/" id={ticket.id+"contentshow"} className="show-more" style={{fontSize : this.state.fontsize-2}} onClick={(e: React.MouseEvent) => {showHide(ticket.id)}}>Show more</a>
		// 				<footer>
		// 					<div className='meta-data'style={{fontSize : this.state.fontsize - 4}}>By <a href={"mailto:"+ticket.userEmail+"?subject=Answer from Wix"+"&body=We read the message you left us titled:\" " + ticket.title + "\""}>{ticket.userEmail}</a> | { new Date(ticket.creationTime).toLocaleString()}</div> 
		// 					<div className="tooltippin"><span className="tooltiptextpin">Pin</span>
		// 					<a href="#/" className="pinButton" onClick={(e: React.MouseEvent) => {this.flipPin(ticket.id)}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi-pin-angle" viewBox="0 0 16 16">
		//   <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.92 5.92 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"/>
		// </svg></a></div>
		// 					{/* <button className='pinButton' onClick={(e: React.MouseEvent) => {this.flipPin(ticket.id)}} type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin-angle" viewBox="0 0 16 16">
		//   <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.92 5.92 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"/>
	// </svg></button> */}
	// 				</footer>
	// 			</li>))}
	// 		</ul>);
	// 	}
	
	
	
	ticketComponent = (ticket: Ticket) => (
	
		<li key={ticket.id} id={ticket.id}  className='ticket'>
			<nav>
				<div className="column"><h5 className='title' style={{fontSize : this.state.fontsize}}>{ticket.title}</h5></div>
				<div className="tooltip"><span className="tooltiptext">Clone</span><button className="clone" onClick={() => this.clone(ticket.id)}>{this.SVGComponent()}</button></div> 
			</nav>
			<p className='contentHide' id={ticket.id+"content"} style={{fontSize : this.state.fontsize -2}}>{ticket.content}</p>
			<a href="#/" id={ticket.id+"contentshow"} className="show-more" style={{fontSize : this.state.fontsize-2}} onClick={(e: React.MouseEvent) => {showHide(ticket.id)}}>Show more</a>
			<footer>
				<div className='meta-data'style={{fontSize : this.state.fontsize - 4}}>
					By <a href={"mailto:"+ticket.userEmail+"?subject=Answer from Wix"+"&body=We read the message you left us titled:\" " + ticket.title + "\""}>{ticket.userEmail}</a> | { new Date(ticket.creationTime).toLocaleString()}
				</div> 
				<div className="tooltippin">
					<span className="tooltiptextpin">Pin</span>
					<a href="#/" className='pinButton' onClick={(e: React.MouseEvent) => {this.flipPin(ticket.id)}}>{ticket.isPinned? this.pinComponent() : this.unPinComponent()}</a>
				</div>
			</footer>
		</li>
	
	);
	
	
	
	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);
		
		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}
	
	render() {	
		const {tickets} = this.state;
		return (<main>
			<h1>
				Tickets List 
				{/* <label className="dark-mode-lable">Dark Mode</label> */}
					
					<label className="switch"> 
						<label className="dark-mode-lable">Dark Mode</label>
						<input type="checkbox" onChange={() => this.darkModeToggle()}/>
						<span className="slider round"></span>
					</label>
			</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			<button className="font-button" id="fontSmall"  onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.SMALL)}} type="button">Small Font</button>
			<button className="font-button" id="fontNormal"  onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.NORMAL)}} type="button">Normal Font</button>
			<button className="font-button" id="fontLarge"  onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.LARGE)}}  type="button">Large Font</button><div><br></br></div>
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}

			<div className="nav">
				<div>			
					<button className="navButton" id="loadMore"  onClick={(e: React.MouseEvent) => {this.loadMore()}}  type="button">Load More</button>
					<h3 id="noItemsToShow" style={{visibility: "hidden"}}>No more tickets to show! 🎉</h3>
				</div>
			</div>
{/* 
			<div className="nav">
			<div className="column">			
			<button className="navButton" id="prevPage"  onClick={(e: React.MouseEvent) => {this.prevPage()}}  type="button">Previous Page</button>
			</div>
			<div className="column">
			<div id="pageCount"><p>{this.state.currentPage}/{this.state.totalPages}</p></div>
			</div>
			<div className="column">
			<button className="navButton" id="nextPage" onClick={(e: React.MouseEvent) => {this.nextPage()}}  type="button">Next Page</button>
			</div>
		</div> */}


		</main>)
	}
}

export default App;