import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
import os
from typing import Dict, Any
from . import models
from sqlalchemy.orm import Session


class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("SMTP_FROM_EMAIL", self.smtp_username)
        self.from_name = os.getenv("SMTP_FROM_NAME", "User Management System")
        self.development_mode = os.getenv("EMAIL_DEVELOPMENT_MODE", "true").lower() == "true"

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        db: Session = None
    ) -> Dict[str, Any]:
        """
        Send email using SMTP with aiosmtplib (async)

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            db: Database session for logging (optional)

        Returns:
            Dict with status and message
        """
        try:
            # Development mode - just log, don't send
            if self.development_mode:
                print(f"\n{'='*60}")
                print(f"📧 DEVELOPMENT MODE - Email Preview")
                print(f"{'='*60}")
                print(f"From: {self.from_name} <{self.from_email}>")
                print(f"To: {to_email}")
                print(f"Subject: {subject}")
                print(f"{'='*60}")
                print(f"Body Preview (first 200 chars):")
                print(html_content[:200] + "..." if len(html_content) > 200 else html_content)
                print(f"{'='*60}\n")

                # Log as sent in development
                if db:
                    self._log_email(db, to_email, subject, html_content, "sent (dev mode)")

                return {
                    "status": "success",
                    "message": f"✅ Email logged (dev mode) - check backend terminal for preview. To: {to_email}"
                }

            # Production mode - actually send
            # Create message
            message = MIMEMultipart("alternative")
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            message["Subject"] = subject

            # Attach HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_username,
                password=self.smtp_password,
                start_tls=True,
            )

            # Log success
            if db:
                self._log_email(db, to_email, subject, html_content, "sent")

            return {
                "status": "success",
                "message": f"Email sent successfully to {to_email}"
            }

        except Exception as e:
            # Log failure
            if db:
                self._log_email(db, to_email, subject, html_content, f"failed: {str(e)}")

            return {
                "status": "error",
                "message": f"Failed to send email: {str(e)}"
            }

    def render_template(self, template_html: str, variables: Dict[str, Any]) -> str:
        """
        Render Jinja2 template with variables

        Args:
            template_html: HTML template string with Jinja2 syntax
            variables: Dictionary of variables to inject

        Returns:
            Rendered HTML string
        """
        template = Template(template_html)
        return template.render(**variables)

    async def send_template_email(
        self,
        to_email: str,
        template: models.EmailTemplate,
        variables: Dict[str, Any],
        db: Session = None
    ) -> Dict[str, Any]:
        """
        Send email using a template with variable substitution

        Args:
            to_email: Recipient email address
            template: EmailTemplate model instance
            variables: Variables to inject into template
            db: Database session for logging (optional)

        Returns:
            Dict with status and message
        """
        # Render template
        rendered_html = self.render_template(template.body_html, variables)
        rendered_subject = self.render_template(template.subject, variables)

        # Send email
        return await self.send_email(to_email, rendered_subject, rendered_html, db)

    def _log_email(
        self,
        db: Session,
        to_email: str,
        subject: str,
        body: str,
        status: str
    ):
        """Log email send attempt to database"""
        try:
            email_log = models.EmailLog(
                to_email=to_email,
                subject=subject,
                body=body,
                status=status
            )
            db.add(email_log)
            db.commit()
        except Exception as e:
            print(f"Failed to log email: {e}")
            db.rollback()


# Singleton instance
email_service = EmailService()
