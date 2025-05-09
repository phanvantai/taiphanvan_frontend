'use client';

import React from 'react';
import Image from 'next/image';

export default function GameNotePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section style={{
        background: 'var(--hero-gradient)',
        borderRadius: '15px',
        padding: '3rem 2rem',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in-out'
      }}>
        <h1 className="section-title">Welcome to Game Note</h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted-color)',
          maxWidth: '700px',
          margin: '0 auto 1rem'
        }}>
          Trải nghiệm ứng dụng cộng đồng bóng đá và esport PES đỉnh cao
        </p>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted-color)',
          maxWidth: '700px',
          margin: '0 auto 2rem'
        }}>
          Tạo các giải đấu, theo dõi số liệu thống kê và tham gia cộng đồng người chơi sôi động
        </p>
      </section>

      {/* App Showcase Section */}
      <section style={{
        textAlign: 'center',
        padding: '2rem 0'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 2rem',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 5px 15px var(--shadow-color)',
          transition: 'transform 0.3s ease'
        }}>
          <Image
            src="/projects/game-note/gamenote.png"
            alt="Game Note App"
            width={600}
            height={500}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* <div style={{
          margin: '2rem auto',
          maxWidth: '200px'
        }}>
          <Image
            src="/projects/game-note/qr_download.png"
            alt="Download Game Note QR Code"
            width={200}
            height={200}
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        </div> */}

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted-color)',
          margin: '1.5rem 0'
        }}>
          Tải về ứng dụng Game Note ngay hôm nay để trải nghiệm những tính năng tuyệt vời!
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          margin: '1.5rem 0'
        }}>
          <a
            href="https://apps.apple.com/app/game-note/id6443969710"
            target="_blank"
            rel="noopener noreferrer"
            style={{ height: '50px', display: 'inline-block' }}
          >
            <Image
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              width={160}
              height={50}
              style={{ height: '100%', width: 'auto' }}
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.november.game_note"
            target="_blank"
            rel="noopener noreferrer"
            style={{ height: '50px', display: 'inline-block' }}
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              width={160}
              height={50}
              style={{ height: '100%', width: 'auto' }}
            />
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        background: 'var(--background-alt-color)',
        padding: '3rem',
        borderRadius: '15px',
        boxShadow: '0 5px 15px var(--shadow-color)',
        marginTop: '3rem'
      }}>
        <h2 className="section-title">Liên hệ với chúng tôi</h2>

        <div style={{
          maxWidth: '500px',
          margin: '2rem auto 0'
        }}>
          <form
            action="https://formspree.io/f/mdknrroj"
            method="POST"
            style={{ textAlign: 'left' }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1.1rem',
                color: 'var(--text-color)',
                fontWeight: '500'
              }}>
                Email của bạn:
              </label>
              <input
                type="email"
                name="email"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1.1rem',
                color: 'var(--text-color)',
                fontWeight: '500'
              }}>
                Nội dung tin nhắn:
              </label>
              <textarea
                name="message"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  height: '150px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
            >
              Gửi
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}