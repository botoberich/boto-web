import React from 'react';
import { Link, navigate } from 'gatsby';
import Helmet from 'react-helmet';

// UI
import { Button } from 'antd';
import SEO from '../components/seo';
import CopyrightYear from '../components/copyright-year';
import Logo from '../images/favicon-96x96.png';

// State
import { handleLogin } from '../app/services/auth.service';

function BotoIcon() {
    return (
        <Link to="/">
            <img alt="Boto Icon" src={Logo} style={{ width: '40px', borderRadius: '50%' }}></img>
        </Link>
    );
}

class IndexPage extends React.Component {
    render() {
        return (
            <>
                <Helmet>
                    <meta charset="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" href="style.css" />
                </Helmet>
                <SEO title="Photo Storage" keywords={[`gatsby`, `application`, `react`, `blockstack`, `photo`]} />
                <div className="is-boxed has-animations">
                    <div className="body-wrap boxed-container">
                        <header className="site-header">
                            <div className="header-shape header-shape-1">
                                <svg width="337" height="222" viewBox="0 0 337 222" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient x1="50%" y1="55.434%" x2="50%" y2="0%" id="header-shape-1">
                                            <stop stopColor="#E0E1FE" stopOpacity="0" offset="0%" />
                                            <stop stopColor="#E0E1FE" offset="100%" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M1103.21 0H1440v400h-400c145.927-118.557 166.997-251.89 63.21-400z"
                                        transform="translate(-1103)"
                                        fill="url(#header-shape-1)"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="header-shape header-shape-2">
                                <svg
                                    width="128"
                                    height="128"
                                    viewBox="0 0 128 128"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient
                                            x1="93.05%"
                                            y1="19.767%"
                                            x2="15.034%"
                                            y2="85.765%"
                                            id="header-shape-2">
                                            <stop stopColor="#FF3058" offset="0%" />
                                            <stop stopColor="#FF6381" offset="100%" />
                                        </linearGradient>
                                    </defs>
                                    <circle
                                        className="anime-element fadeup-animation"
                                        cx="64"
                                        cy="64"
                                        r="64"
                                        fill="url(#header-shape-2)"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="container">
                                <div className="site-header-inner">
                                    <div className="brand header-brand">
                                        <h1 className="m-0">
                                            <BotoIcon></BotoIcon>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <main>
                            <section className="hero">
                                <div className="container">
                                    <div className="hero-inner">
                                        <div className="hero-copy">
                                            <h1 className="hero-title mt-0">Welcome to Boto</h1>
                                            <p className="hero-paragraph">
                                                Your new private, secure, and unlimited photo storage
                                            </p>
                                            <div className="hero-form field field-grouped">
                                                <div className="control">
                                                    <Button
                                                        className="button button-primary button-block"
                                                        onClick={() => {
                                                            handleLogin(() => {
                                                                navigate(`/app/`);
                                                            });
                                                        }}
                                                        style={{
                                                            alignItems: 'center',
                                                            borderRadius: '8px',
                                                            height: '60px',
                                                            margin: '0 auto',
                                                        }}>
                                                        Get Early Access
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hero-illustration">
                                            <div className="hero-shape hero-shape-1">
                                                <svg
                                                    width="40"
                                                    height="40"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ overflow: 'visible' }}>
                                                    <circle
                                                        className="anime-element fadeup-animation"
                                                        cx="20"
                                                        cy="20"
                                                        r="20"
                                                        fill="#FFD8CD"
                                                        fillRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="hero-shape hero-shape-2">
                                                <svg
                                                    width="88"
                                                    height="88"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ overflow: 'visible' }}>
                                                    <circle
                                                        className="anime-element fadeup-animation"
                                                        cx="44"
                                                        cy="44"
                                                        r="44"
                                                        fill="#FFD2DA"
                                                        fillRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="hero-main-shape">
                                                {/* TODO: Insert main image */}
                                                <img alt="Boto family" src="hero-svg.svg" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="features section">
                                <div className="container">
                                    <div className="features-inner section-inner">
                                        <div className="features-header text-center">
                                            <div className="container-sm">
                                                <h2 className="section-title mt-0">Explore</h2>
                                                <p className="section-paragraph">
                                                    We're still in early access, but please enjoy our core features.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="features-wrap">
                                            <div className="feature text-center is-revealing">
                                                <div className="feature-inner">
                                                    <div className="feature-icon" style={{ background: '#FFD2DA' }}>
                                                        <svg width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="none" fillRule="nonzero">
                                                                <path
                                                                    d="M43 47v7a13 13 0 0 0 13-13v-7c-7.18 0-13 5.82-13 13z"
                                                                    fill="#FF6381"
                                                                />
                                                                <path
                                                                    d="M32 41v4a9 9 0 0 0 9 9v-4a9 9 0 0 0-9-9z"
                                                                    fill="#FF97AA"
                                                                />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <h4 className="feature-title h3-mobile mb-8">Unlimited Storage</h4>
                                                    <p className="text-sm">
                                                        With Blockstack empowering us, you'll have plenty of space for
                                                        all your photos (plenty as in unlimited).
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="feature text-center is-revealing">
                                                <div className="feature-inner">
                                                    <div className="feature-icon" style={{ background: '#FFD8CD' }}>
                                                        <svg width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="none" fillRule="nonzero">
                                                                <path
                                                                    d="M54 56h-9a2 2 0 0 1-2-2V43a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2zm-9-13v10h9V43h-9z"
                                                                    fill="#FCAC96"
                                                                />
                                                                <path
                                                                    d="M41 50h-7V34h14v5h2v-5a2 2 0 0 0-2-2H34a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h7v-4z"
                                                                    fill="#FC8464"
                                                                />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <h4 className="feature-title h3-mobile mb-8">Easy to Use</h4>
                                                    <p className="text-sm">
                                                        We're building Boto to be as intelligently-designed as possible
                                                        to do what you want most, quickly and easily.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="feature text-center is-revealing">
                                                <div className="feature-inner">
                                                    <div className="feature-icon" style={{ background: '#C6FDF3' }}>
                                                        <svg width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="none" fillRule="nonzero">
                                                                <circle fill="#1ADAB7" cx="38" cy="50" r="5" />
                                                                <path
                                                                    d="M53 42h2v-8a1 1 0 0 0-1-1h-8v2h5.586l-8.293 8.293a1 1 0 1 0 1.414 1.414L53 36.414V42z"
                                                                    fill="#1ADAB7"
                                                                />
                                                                <path
                                                                    fill="#83F0DD"
                                                                    d="M34 41.414l3-3 3 3L41.414 40l-3-3 3-3L40 32.586l-3 3-3-3L32.586 34l3 3-3 3zM55.414 48L54 46.586l-3 3-3-3L46.586 48l3 3-3 3L48 55.414l3-3 3 3L55.414 54l-3-3z"
                                                                />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <h4 className="feature-title h3-mobile mb-8">Private</h4>
                                                    <p className="text-sm">
                                                        All your data always stays with you. Only the minimum sits on
                                                        our side so we can serve you up the right stuff.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="feature text-center is-revealing">
                                                <div className="feature-inner">
                                                    <div className="feature-icon" style={{ background: '#E0E1FE' }}>
                                                        <svg width="88" height="88" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="none" fillRule="nonzero">
                                                                <path
                                                                    d="M41 42h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1zM41 55h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"
                                                                    fill="#4950F6"
                                                                />
                                                                <path
                                                                    fill="#8D92FA"
                                                                    d="M45 34h10v2H45zM45 39h10v2H45zM45 47h10v2H45zM45 52h10v2H45z"
                                                                />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <h4 className="feature-title h3-mobile mb-8">Secure</h4>
                                                    <p className="text-sm">
                                                        Because your data always stays with you, there'll never be a
                                                        scary data breach exposing your cherished memories.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="newsletter section text-light">
                                <div className="container-sm">
                                    <div className="newsletter-inner section-inner">
                                        <div className="newsletter-header text-center">
                                            <h2 className="section-title mt-0">
                                                See some potential in us? Stay in touch!
                                            </h2>
                                            <p className="section-paragraph">
                                                Yes, no newsletter. Just plain-old direct emailing.
                                            </p>
                                        </div>
                                        <div className="footer-form newsletter-form field field-grouped justify-content-center">
                                            <div className="control">
                                                <a
                                                    className="button button-primary button-block button-shadow"
                                                    href="mailto:team@boto.photos">
                                                    Contact us!
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <footer className="site-footer">
                            <div className="container">
                                <div className="site-footer-inner has-top-divider">
                                    <div className="brand footer-brand">
                                        <BotoIcon></BotoIcon>
                                    </div>
                                    {/* <ul className="footer-links list-reset">
                                        <li>
                                            <a href="#">Contact</a>
                                        </li>
                                        <li>
                                            <a href="#">About us</a>
                                        </li>
                                        <li>
                                            <a href="#">FAQ's</a>
                                        </li>
                                        <li>
                                            <a href="#">Support</a>
                                        </li>
                                    </ul> */}
                                    {/* <ul className="footer-social-links list-reset">
                                        <li>
                                            <a href="#">
                                                <span className="screen-reader-text">Facebook</span>
                                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="screen-reader-text">Twitter</span>
                                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="screen-reader-text">Google</span>
                                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul> */}
                                    <div className="footer-copyright">
                                        <p>
                                            &copy; <CopyrightYear />, all rights reserved.
                                        </p>
                                        <p>
                                            Template from <a href="https://cruip.com/">Cruip</a>
                                        </p>
                                        <p>
                                            Banner art from <a href="https://iradesign.io">IRA Design</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </>
        );
    }
}

export default IndexPage;
