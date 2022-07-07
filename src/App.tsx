import React, { Component, HTMLAttributes } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import logo from './logo.svg';
import './App.css';

import Game from './components/Game/Game'
import RecordsTable from './components/RecordsTable/RecordsTable';

interface Props {
	cookies: Cookies
}

interface State {
	records: { name: string, score: number }[]
}

class App extends Component<Props & HTMLAttributes<HTMLDivElement>, State> {

	constructor(props: Props) {
		super(props);
		let { cookies } = this.props;
		let data = cookies.get("records");
		if (!data) {
			this.state = {
				records: [],
			}
		}
		else {
			this.state = {
				records: data.records,
			}
		}
	}

	getRecords = () => this.state.records
	addNewRecord = (name: string, score: number) => {
		let record = {
			name: name,
			score: score
		};
		let records = [...this.state.records, record];
		records.sort((a, b) => {
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			return 0;
		})
		this.setState({
			records: records
		});
	}

	render(): React.ReactNode {
		return (
			<div className="App">
				<BrowserRouter>
					<div className="dashboard">
						<NavLink className="Link" to="/">Игра</NavLink>
						<NavLink className="Link" to="/records_table">Рекорды</NavLink>
					</div>

					<Routes>
						<Route path="/" element={<Game addNewRecord={this.addNewRecord} cookies={this.props.cookies} />} />
						<Route path="/records_table" element={<RecordsTable getRecords={this.getRecords} />} />
					</Routes>
				</BrowserRouter>
			</div>
		);

	}

	componentDidUpdate() {
		if (this.state.records.length !== 0) {
			let { cookies } = this.props;

			let oldTableRecords = JSON.stringify(cookies.get("records"));
			let newTableRecords = JSON.stringify({
				records: this.state.records,
			});
			if (newTableRecords !== oldTableRecords)
				cookies.set("records", newTableRecords, { path: "/" });
		}

	}

}

export default withCookies(App);
