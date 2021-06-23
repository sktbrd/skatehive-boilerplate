import React from 'react';
import { useEffect } from 'react';
import { Col, Container, Row, Button } from "react-bootstrap";
import { _t } from '../../i18n';

export interface Props {
    title: string;
    description: React.ReactNode;
    media: string;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    placement?: string
}

export const Introduction = ({ title, description, media, onClose, onPrevious, onNext, placement }: Props) => {
    useEffect(() => {
        let body = document.getElementsByTagName('body')[0];
        body.classList.add("overflow-hidden");
        return () => {
            body.classList.remove("overflow-hidden");
        }
    },[]);

    return <>
    <div className="intro-popup" style={{left: placement}}>
    <Container className="h-100">
       
        <button type="button" className="close position-absolute close-btn" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
        </button>
        <Row className="justify-content-center h-100 align-items-center">
            <Col xs={12} md={3}>
                <img width="100%" src={media} />
            </Col>
            <Col xs={12} md={5}>
                <h1 className="mb-4 text-dark font-weight-bold">{title}</h1>
                <p className="text-muted paragraph">{description}</p>
                <div className='d-flex'>
                    {onPrevious && <Button size="lg" variant="outline-primary" className="mr-3 w-50 intro-btn" onClick={()=>{onPrevious()}}>{_t('g.previous')}</Button>}
                    {onNext && <Button size="lg" variant="primary" className="w-50 intro-btn" onClick={()=>{onNext()}}>{_t('g.next')}</Button>}
                </div>
            </Col>
        </Row>
    </Container>
</div>

    </>
  
}