import { Component, HTMLAttributes, ReactNode } from "react";
import './RecordsTable.css';

interface Props {
    getRecords: () => {name: string, score: number}[];
}

interface State {
}

class RecordsTable extends Component<Props & HTMLAttributes<HTMLDivElement>, State> {

    private getRecords: () => {name: string, score: number}[];

    constructor(props: Props) {
        super(props);

        this.getRecords = props.getRecords;
    }

    getRecordsInTegTr = () => {
        let records = this.getRecords();
        let recordsInTegTr = [];
        for (let i = 0; i < records.length; i++) {
            const element = records[i];
            recordsInTegTr.push(
                <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{element.name}</td>
                    <td>{element.score}</td>
                </tr>
            );
        }
        return recordsInTegTr;
    }

    render(): ReactNode {
        return (
            <div className='RecordsTable'>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Имя</th>
                            <th scope="col">Счет</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getRecordsInTegTr()}
                    </tbody>


                </table>
            </div>
        );
    }
    
}

export default RecordsTable;