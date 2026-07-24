import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";
import { ArrowRight } from "../common/Icons";

import "./CallToAction.css";

export default function CallToAction() {
    const navigate = useNavigate();

    return (
        <section className="call-to-action">
            <Container>
                <div className="cta-card">
                    <div className="cta-card__content">
                        <span className="cta-card__eyebrow">
                            Ready to Start?
                        </span>

                        <h2>
                            Find Your Dream Job with ApexHire
                        </h2>

                        <p>
                            Join thousands of professionals and leading
                            companies using ApexHire to connect with the
                            right opportunities every day.
                        </p>
                    </div>

                    <div className="cta-card__actions">
                        <Button
                            size="lg"
                            onClick={() => navigate("/jobs")}
                            rightIcon={
                                <ArrowRight
                                    size={18}
                                    strokeWidth={2}
                                />
                            }
                        >
                            Browse Jobs
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}