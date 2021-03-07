import React from "react";
import { Ticket } from "../api";
import { CloneComponent } from "./clone";
import { PinComponent } from "./pin";
import { UnPinComponent } from "./unpin.tsk";

export type TicketComponentProps = {
	ticket: Ticket,
	fontsize: number,
	clone: Function,
	flipPin: Function,
	showHide: Function,
}

export class TicketComponent extends React.Component<TicketComponentProps> {
	render() {
		return (
		<><nav>
				<div className="column"><h5 className='title' style={{ fontSize: this.props.fontsize }}>{this.props.ticket.title}</h5></div>
				<div className="tooltip"><span className="tooltiptext">Clone</span><button className="clone" onClick={() => this.props.clone(this.props.ticket.id)}><CloneComponent /></button></div></nav><p className='contentHide' id={this.props.ticket.id + "content"} style={{ fontSize: this.props.fontsize - 2 }}>{this.props.ticket.content}</p><a href="#/" id={this.props.ticket.id + "contentshow"} className="show-more" style={{ fontSize: this.props.fontsize - 2 }} onClick={(e: React.MouseEvent) => { this.props.showHide(this.props.ticket.id); } }>Show more</a>
				<footer>
					<div className='meta-data' style={{ fontSize: this.props.fontsize - 4 }}>
						By <a href={"mailto:" + this.props.ticket.userEmail + "?subject=Answer from Wix&body=We read the message you left us titled: \"" + this.props.ticket.title + "\""}>{this.props.ticket.userEmail}</a> | {new Date(this.props.ticket.creationTime).toLocaleString()}
					</div>
					<div className="tooltippin">
						<span className="tooltiptextpin">Pin</span>
						<a href="#/" className='pinButton' onClick={(e: React.MouseEvent) => { this.props.flipPin(this.props.ticket.id); } }>{this.props.ticket.isPinned ? <PinComponent /> : <UnPinComponent />}</a>
					</div>
				</footer></>
	)
	}
}

