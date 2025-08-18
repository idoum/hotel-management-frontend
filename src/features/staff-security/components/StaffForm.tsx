// src/features/staff-security/components/StaffForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import InputField from '@/components/forms/InputField';
import { StaffService } from '../services/staff.service';

interface Props {
  show: boolean;
  onHide: () => void;
}

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  departmentId?: string;
}

export default function StaffForm({ show, onHide }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormData>();

  const onSubmit = async (data: StaffFormData) => {
    await StaffService.createStaff({ ...data });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un membre</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <InputField
                label="Prénom"
                register={register('firstName', { required: 'Obligatoire' })}
                error={errors.firstName}
              />
            </Col>
            <Col md={6}>
              <InputField
                label="Nom"
                register={register('lastName', { required: 'Obligatoire' })}
                error={errors.lastName}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <InputField
                type="email"
                label="Email"
                register={register('email', { required: 'Obligatoire' })}
                error={errors.email}
              />
            </Col>
            <Col md={6}>
              <InputField
                label="Téléphone"
                register={register('phone')}
                error={errors.phone}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rôle</Form.Label>
                <Form.Select {...register('roleId', { required: 'Obligatoire' })} isInvalid={!!errors.roleId}>
                  <option value="">Choisir…</option>
                  {/* map roles depuis un hook useRoles */}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.roleId?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Département</Form.Label>
                <Form.Select {...register('departmentId')}>
                  <option value="">—</option>
                  {/* map departments */}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
