export default function NewsDetailLoading() {
    return (
        <div className="newsDetailContainer">
            <div
                style={{
                    height: '3rem',
                    width: '80%',
                    backgroundColor: 'var(--bg-secondary)',
                    marginBottom: '1.5rem',
                    borderRadius: '4px'
                }}
            ></div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '2rem'
                }}
            >
                <div
                    style={{
                        height: '1rem',
                        width: '30%',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px'
                    }}
                ></div>
                <div
                    style={{
                        height: '1rem',
                        width: '20%',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px'
                    }}
                ></div>
            </div>

            <div
                style={{
                    height: '400px',
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    marginBottom: '2rem',
                    borderRadius: '8px'
                }}
            ></div>

            <div
                style={{
                    height: '10rem',
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    marginBottom: '2rem',
                    borderRadius: '8px'
                }}
            ></div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem'
                }}
            >
                <div
                    style={{
                        height: '2.5rem',
                        width: '10rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px'
                    }}
                ></div>
                <div
                    style={{
                        height: '2.5rem',
                        width: '10rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px'
                    }}
                ></div>
            </div>
        </div>
    );
}
